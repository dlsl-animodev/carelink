"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Define types
interface Inventory {
  id: string;
  medication_name: string;
  concentration?: string;
  unit_price: number;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  contact_phone: string;
  logo_url?: string;
  delivery_fee: number;
  estimated_delivery_mins: number;
  inventory: Inventory;
}

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [pharmaciesLoading, setPharmaciesLoading] = useState(true);

  // Dummy data
  const dummyPharmacies: Pharmacy[] = [
    {
      id: "1",
      name: "PetCare Pharmacy",
      address: "123 Animal St",
      city: "Manila",
      contact_phone: "0917-123-4567",
      logo_url: "https://placekitten.com/100/100",
      delivery_fee: 50,
      estimated_delivery_mins: 45,
      inventory: {
        id: "a1",
        medication_name: "Feline Vitamins",
        concentration: "500mg",
        unit_price: 250,
      },
    },
    {
      id: "2",
      name: "Happy Pets Pharmacy",
      address: "456 Paw Ave",
      city: "Quezon City",
      contact_phone: "0922-765-4321",
      logo_url: "https://placekitten.com/101/101",
      delivery_fee: 75,
      estimated_delivery_mins: 60,
      inventory: {
        id: "b2",
        medication_name: "Doggie Pain Relief",
        concentration: "250mg",
        unit_price: 350,
      },
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setPharmacies(dummyPharmacies);
      setPharmaciesLoading(false);
    }, 1000);
  }, []);

  const handleSelectPharmacy = (pharmacy: Pharmacy) => {
    alert(`Selected pharmacy: ${pharmacy.name}`);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Link
        href="/dashboard"
        className="text-blue-600 hover:underline hover:cursor-pointer"
      >
        &larr; Back to Dashboard
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-orange-500">Select a Pharmacy to Order From</h1>
        <p className="text-gray-600">
          Browse available pharmacies and choose one to place your order.
        </p>
      </div>

      <section>
        <p className="text-2xl font-bold mb-4">Available Pharmacies</p>

        {pharmaciesLoading ? (
          <p className="text-gray-600">Loading pharmacies...</p>
        ) : pharmacies.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600">
                No pharmacies currently have this medication in stock.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please check back later or contact your veterinarian for alternatives.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pharmacies.map((pharmacy) => (
              <Card key={`${pharmacy.id}-${pharmacy.inventory.id}`} className="w-full">
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {pharmacy.logo_url && (
                      <img
                        src={pharmacy.logo_url}
                        alt={pharmacy.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{pharmacy.name}</h3>
                      <p className="text-gray-600">
                        {pharmacy.address}, {pharmacy.city}
                      </p>
                      <p className="text-gray-600">Contact: {pharmacy.contact_phone}</p>

                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{pharmacy.inventory.medication_name}</p>
                        {pharmacy.inventory.concentration && (
                          <p className="text-sm text-gray-600">
                            Concentration: {pharmacy.inventory.concentration}
                          </p>
                        )}
                        <p className="text-lg font-bold text-green-600">
                          ₱{pharmacy.inventory.unit_price.toFixed(2)} per unit
                        </p>
                        <p className="text-sm text-gray-600">
                          Delivery fee: ₱{pharmacy.delivery_fee.toFixed(2)} (
                          {pharmacy.estimated_delivery_mins} mins est.)
                        </p>
                      </div>
                    </div>
                    <Button
                      className="mt-4 md:mt-0 px-6 py-2 rounded-2xl hover:cursor-pointer"
                      onClick={() => handleSelectPharmacy(pharmacy)}
                    >
                      Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
