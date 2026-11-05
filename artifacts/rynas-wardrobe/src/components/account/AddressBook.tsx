"use client";

import React, { useState } from "react";
import { Plus, MapPin, Check, Trash2, Edit2, X } from "lucide-react";
import { SavedAddress } from "@/types/account";
import { useStore } from "@/lib/store";

export function AddressBook() {
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultShipping,
    setDefaultBilling,
  } = useStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<SavedAddress, "id">>({
    label: "Home",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "India",
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  const handleOpenAdd = () => {
    setEditingAddressId(null);
    setFormData({
      label: "Home",
      firstName: "",
      lastName: "",
      email: "",
      phone: "+91 ",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postcode: "",
      country: "India",
      isDefaultShipping: addresses.length === 0,
      isDefaultBilling: addresses.length === 0,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setFormData({
      label: addr.label,
      firstName: addr.firstName,
      lastName: addr.lastName,
      email: addr.email,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      postcode: addr.postcode,
      country: addr.country,
      isDefaultShipping: addr.isDefaultShipping,
      isDefaultBilling: addr.isDefaultBilling,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddress(editingAddressId, formData);
    } else {
      addAddress(formData);
    }
    setIsFormOpen(false);
    setEditingAddressId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#D8CFC6]">
        <div>
          <h2 className="font-editorial text-[24px] sm:text-[28px] text-[#302B28]">
            Saved Addresses ({addresses.length})
          </h2>
          <p className="text-[13px] text-[#69615B]">
            Manage your boutique delivery destinations and default invoice addresses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-6 bg-[#FFFDFA] border transition-colors relative flex flex-col justify-between ${
              addr.isDefaultShipping
                ? "border-[#713A48] shadow-xs"
                : "border-[#D8CFC6]"
            }`}
          >
            <div>
              {/* Top Tags */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 bg-[#F8F5EF] text-[#713A48] border border-[#D8CFC6]">
                  {addr.label}
                </span>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {addr.isDefaultShipping && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#3E6545] bg-[#EAF2EC] px-2 py-0.5 border border-[#3E6545]/20">
                      Default Shipping
                    </span>
                  )}
                  {addr.isDefaultBilling && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#69615B] bg-[#F8F5EF] px-2 py-0.5 border border-[#D8CFC6]">
                      Default Billing
                    </span>
                  )}
                </div>
              </div>

              {/* Name & Address */}
              <h3 className="font-editorial text-[18px] text-[#302B28] mb-1">
                {addr.firstName} {addr.lastName}
              </h3>
              <p className="text-[14px] text-[#69615B] leading-relaxed mb-4">
                {addr.addressLine1}
                {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                <br />
                {addr.city} {addr.postcode}
                <br />
                {addr.country}
                <br />
                <span className="text-[12px] text-[#69615B] block mt-1">
                  Contact: {addr.phone}
                </span>
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#F0EAE1] flex flex-wrap items-center justify-between gap-3 text-[12px]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(addr)}
                  className="text-[#713A48] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Remove this saved address?")) {
                        deleteAddress(addr.id);
                      }
                    }}
                    className="text-[#963D37] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!addr.isDefaultShipping && (
                  <button
                    type="button"
                    onClick={() => setDefaultShipping(addr.id)}
                    className="text-[#69615B] hover:text-[#302B28] hover:underline text-[11px] cursor-pointer"
                  >
                    Set as shipping
                  </button>
                )}
                {!addr.isDefaultBilling && (
                  <button
                    type="button"
                    onClick={() => setDefaultBilling(addr.id)}
                    className="text-[#69615B] hover:text-[#302B28] hover:underline text-[11px] cursor-pointer"
                  >
                    Set as billing
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Address Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302B28]/60 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-[620px] my-8 bg-[#FFFDFA] border border-[#D8CFC6] shadow-2xl">
            <div className="p-6 border-b border-[#D8CFC6] flex items-center justify-between bg-[#F8F5EF]">
              <h3 className="font-editorial text-[22px] text-[#302B28]">
                {editingAddressId ? "Edit Saved Address" : "Add New Delivery Address"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-[#69615B] hover:text-[#713A48] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-7 flex flex-col gap-4">
              {/* Label */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                  Address Label
                </label>
                <div className="flex gap-2">
                  {(["Home", "Work", "Atelier", "Other"] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setFormData({ ...formData, label: l })}
                      className={`px-3.5 py-1.5 text-[12px] border transition-colors cursor-pointer ${
                        formData.label === l
                          ? "bg-[#713A48] text-[#FFFDFA] border-[#713A48]"
                          : "bg-[#F8F5EF] text-[#302B28] border-[#D8CFC6]"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                  />
                </div>
              </div>

              {/* Address Lines */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine1: e.target.value })
                  }
                  required
                  placeholder="House / building name and street"
                  className="w-full px-3.5 py-2 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                  Apartment, Suite, Unit · optional
                </label>
                <input
                  type="text"
                  value={formData.addressLine2 || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, addressLine2: e.target.value })
                  }
                  placeholder="Floor, apartment number, landmark"
                  className="w-full px-3.5 py-2 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                />
              </div>

              {/* City, PIN, Country */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                    City / Town
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                    PIN / Postcode
                  </label>
                  <input
                    type="text"
                    value={formData.postcode}
                    onChange={(e) =>
                      setFormData({ ...formData, postcode: e.target.value })
                    }
                    required
                    placeholder="e.g. 400026"
                    className="w-full px-3.5 py-2 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                  >
                    <option value="India">India</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="France">France</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#69615B] mb-1 font-medium">
                  Phone Number (for courier SMS)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  placeholder="+91 98200 12345"
                  className="w-full px-3.5 py-2 text-[14px] text-[#302B28] bg-[#F8F5EF] border border-[#D8CFC6] focus:border-[#713A48] outline-none"
                />
              </div>

              {/* Defaults Checkboxes */}
              <div className="flex flex-col gap-2 pt-2">
                <label className="flex items-center gap-2.5 text-[13px] text-[#302B28] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefaultShipping}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isDefaultShipping: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#713A48] cursor-pointer"
                  />
                  <span>Use as my default shipping address</span>
                </label>

                <label className="flex items-center gap-2.5 text-[13px] text-[#302B28] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefaultBilling}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isDefaultBilling: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#713A48] cursor-pointer"
                  />
                  <span>Use as my default billing address</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#D8CFC6] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 text-[13px] text-[#69615B] hover:text-[#302B28]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 bg-[#713A48] text-[#FFFDFA] text-[13px] font-medium tracking-wide hover:bg-[#582D38] transition-colors shadow-xs"
                >
                  {editingAddressId ? "Save Changes" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
