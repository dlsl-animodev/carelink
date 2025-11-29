"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = (formData.get("role") as string) || "pet_owner";
  const specialty = (formData.get("specialty") as string) || "General Practice";
  const licenseNumber = (formData.get("licenseNumber") as string) || null;
  const nextUrl = (formData.get("next") as string) || null;

  // check if current user is anonymous (upgrading account)
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  const isUpgrade = currentUser?.is_anonymous === true

  if (isUpgrade) {
    // convert anonymous user to registered user
    const { data, error } = await supabase.auth.updateUser({
      email,
      password,
      data: {
        full_name: fullName,
        role: role,
      }
    })

    if (error) {
      return { error: error.message }
    }

    // update profile to mark as converted
    await supabase
      .from('profiles')
      .update({
        is_anonymous: false,
        full_name: fullName,
        email: email,
        role: role,
        converted_at: new Date().toISOString()
      })
      .eq('id', currentUser.id)

    // migrate any pre-consult data
    await supabase
      .from('guest_pre_consults')
      .update({ is_migrated: true })
      .eq('user_id', currentUser.id)
      .eq('is_migrated', false)

    // if upgrading to veterinarian, create veterinarian profile
    if (role === 'veterinarian' && data.user) {
      const licenseNumber = formData.get('licenseNumber') as string || null
      const { error: vetError } = await supabase.from('veterinarians').insert({
        user_id: data.user.id,
        name: `Dr. ${fullName}`,
        specialty: specialty,
        license_number: licenseNumber,
        species_treated: ['Dogs', 'Cats'],
        bio: `${specialty} veterinarian dedicated to providing quality pet care.`,
        is_available: true,
      })

      if (vetError) {
        console.error('Failed to create veterinarian profile:', vetError)
      }
    }

    revalidatePath('/', 'layout')
    redirect(nextUrl || '/dashboard')
  }

  // regular signup for new users
  const { error, data: signupData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
        specialty: role === 'veterinarian' ? specialty : null,
        license_number: role === 'veterinarian' ? licenseNumber : null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // if signing up as veterinarian, create veterinarian profile
  if (role === 'veterinarian' && signupData?.user) {
    const { error: vetError } = await supabase.from('veterinarians').insert({
      user_id: signupData.user.id,
      name: `Dr. ${fullName}`,
      specialty: specialty,
      license_number: licenseNumber,
      species_treated: ['Dogs', 'Cats'],
      bio: `${specialty} veterinarian dedicated to providing quality pet care.`,
      is_available: true,
    })

    if (vetError) {
      console.error('Failed to create veterinarian profile:', vetError)
    }
  }

  revalidatePath("/", "layout");
  redirect(nextUrl || "/dashboard");
}

export async function signInAnonymously(captchaToken?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInAnonymously({
    options: captchaToken ? { captchaToken } : undefined,
  })

  if (error) {
    return { error: error.message }
  }

  // create an anonymous session record
  if (data.user) {
    await supabase.from('anonymous_sessions').insert({
      user_id: data.user.id,
      browsing_data: {},
    })
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

// helper to check if user is anonymous
export async function getAuthStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { isAuthenticated: false, isAnonymous: false, user: null }
  }

  return {
    isAuthenticated: true,
    isAnonymous: user.is_anonymous ?? false,
    user
  }
}
