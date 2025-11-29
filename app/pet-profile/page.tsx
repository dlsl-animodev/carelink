interface PetProfilePageProps {
    searchParams : Promise<{
        petId: string;
    }>
}

export default function PetProfilePage({ searchParams }: PetProfilePageProps) {


    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            {/* Title  */}

            <div>
                <h1 className="text-3xl font-bold text-blue-900">
                    Pet Details
                </h1>
                <p className="text-gray-600">
                    View and manage your pet details.
                </p>
            </div>

            
        </div>
    );
}
