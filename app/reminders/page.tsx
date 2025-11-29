"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RemindersPage() {
    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <Link href="/dashboard" className="text-blue-600 hover:underline ">
                &larr; Back to Dashboard
            </Link>

            <div className="mt-6">
                <h1 className="text-3xl font-bold ">Reminders</h1>
                <p className="text-gray-600">
                    Manage your pet care reminders here.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {/* Reminder 1 */}
                <Card className="bg-[#eab05c]">
                    <CardContent className="space-y-6">
                        <Badge variant={"outline"}> Luna </Badge>
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">By Dr. Santos</p>
                            <p className="text-sm"> Feb 10, 2025 | 3:30 PM </p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold">
                                Annual Vaccination
                            </p>
                            <p>
                                Luna is due for her yearly DHPP and rabies
                                shots. Please bring her vaccination card.
                            </p>
                        </div>
                        <Button className="w-full">View details</Button>
                    </CardContent>
                </Card>

                {/* Reminder 2 */}
                <Card className="bg-[#eab05c]">
                    <CardContent className="space-y-6">
                        <Badge variant={"outline"}> Max </Badge>
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">By Dr. Ramos</p>
                            <p className="text-sm"> Mar 02, 2025 | 9:00 AM </p>
                        </div>
                        <div>
                            <p className="text-2xl font-semibold">
                                Heartworm Medication
                            </p>
                            <p>
                                Monthly heartworm prevention dose. Make sure Max
                                takes the chewable tablet after breakfast.
                            </p>
                        </div>
                        <Button className="w-full">View details</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
