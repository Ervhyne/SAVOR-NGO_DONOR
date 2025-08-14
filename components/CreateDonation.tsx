import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ArrowLeft, Camera, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { AppPage, Donation } from "../App";

interface CreateDonationProps {
  onNavigate: (page: AppPage) => void;
  onCreateDonation: (
    donation: Omit<
      Donation,
      | "id"
      | "donorId"
      | "donorName"
      | "status"
      | "createdAt"
      | "updatedAt"
      | "trackingNotes"
      | "ngoId"
      | "ngoName"
      | "estimatedMeals"
      | "assignedVolunteer"
    >
  ) => void;
}

export function CreateDonation({
  onNavigate,
  onCreateDonation,
}: CreateDonationProps) {
  const [formData, setFormData] = useState({
    foodName: "",
    description: "",
    quantity: "",
    units: "kg",
    expirationDate: "",
    category: "" as "perishable" | "non-perishable" | "cooked" | "packaged" | "",
    photos: [] as string[],
    pickupDate: "",
    deliveryMethod: "drop-off" as "drop-off" | "pickup",
  });

  const foodCategories = [
    { id: "fresh-produce", label: "Fresh Produce" },
    { id: "canned-goods", label: "Canned Goods" },
    { id: "bread-bakery", label: "Bread & Bakery" },
    { id: "cooked-food", label: "Cooked Food" },
    { id: "dairy", label: "Dairy Products" },
    { id: "dry-goods", label: "Dry Goods" },
  ];

  const unitOptions = [
    "kg",
    "lbs",
    "pieces",
    "packs",
    "trays",
    "boxes",
    "bags",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.foodName ||
      !formData.quantity ||
      !formData.category ||
      !formData.pickupDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const donation: Omit<
      Donation,
      | "id"
      | "donorId"
      | "donorName"
      | "status"
      | "createdAt"
      | "updatedAt"
      | "trackingNotes"
      | "ngoId"
      | "ngoName"
      | "estimatedMeals"
      | "assignedVolunteer"
    > = {
      foodName: formData.foodName,
      description: formData.description,
      quantity: formData.quantity,
      units: formData.units,
      expirationDate: formData.expirationDate,
      category: formData.category,
      photos: formData.photos,
      pickupDate: formData.pickupDate,
      deliveryMethod: formData.deliveryMethod,
    };

    onCreateDonation(donation);
    toast.success("Donation created successfully!");
    onNavigate("donor-dashboard");
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("donor-dashboard")}
            className="mr-2 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">
            Create Donation
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Food Donation Details</CardTitle>
            <p className="text-sm text-muted-foreground">
              Provide information about the food you want to
              donate
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Food Name */}
              <div>
                <Label htmlFor="foodName">Food Name *</Label>
                <Input
                  id="foodName"
                  value={formData.foodName}
                  onChange={(e) =>
                    handleInputChange(
                      "foodName",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., Mixed Vegetables, Bread Loaves"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange(
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Additional details about the food"
                  rows={3}
                />
              </div>

              {/* Quantity and Units */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange(
                        "quantity",
                        e.target.value,
                      )
                    }
                    placeholder="Amount"
                  />
                </div>
                <div>
                  <Label htmlFor="units">Units</Label>
                  <select
                    id="units"
                    value={formData.units}
                    onChange={(e) =>
                      handleInputChange("units", e.target.value)
                    }
                    className="w-full p-2 border border-input rounded-md bg-background h-10"
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category */}
              <div>
                <Label>Food Category *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {foodCategories.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant={
                        formData.category === category.id
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleInputChange(
                          "category",
                          category.id,
                        )
                      }
                      className="h-12 text-sm"
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <Label htmlFor="expirationDate">
                  Expiration Date (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) =>
                      handleInputChange(
                        "expirationDate",
                        e.target.value,
                      )
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <Label>Photo (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Add a photo of your donation
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                  >
                    Choose Photo
                  </Button>
                </div>
              </div>

              {/* Pickup Date */}
              <div>
                <Label htmlFor="pickupDate">
                  Pickup/Delivery Date *
                </Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) =>
                    handleInputChange(
                      "pickupDate",
                      e.target.value,
                    )
                  }
                  min={getTomorrowDate()}
                />
              </div>

              {/* Delivery Method */}
              <div>
                <Label>Delivery Method *</Label>
                <RadioGroup
                  value={formData.deliveryMethod}
                  onValueChange={(value) =>
                    handleInputChange("deliveryMethod", value)
                  }
                  className="mt-2"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem
                        value="drop-off"
                        id="drop-off"
                        className="mt-1"
                      />
                      <div>
                        <Label
                          htmlFor="drop-off"
                          className="font-medium"
                        >
                          I will drop off
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Deliver to NGO collection point
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RadioGroupItem
                        value="pickup"
                        id="pickup"
                        className="mt-1"
                      />
                      <div>
                        <Label
                          htmlFor="pickup"
                          className="font-medium"
                        >
                          Arrange pickup
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          NGO will collect from your location
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full">
                Create Donation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
