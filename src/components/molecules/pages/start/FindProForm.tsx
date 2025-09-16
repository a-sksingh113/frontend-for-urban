/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import FileUploader from "@/components/molecules/pages/start/FileUploader";
import LocationPicker from "@/components/molecules/pages/start/LocationPicker";
import GetLeadsCTA from "@/components/molecules/pages/start/GetLeadsCTA";
import { useSubmitProblemMutation } from "@/redux/api/problemApi";
import { handleApiError } from "@/lib/handleApiError";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchingOverlay from "@/components/molecules/global/animation/SearchingOverlay";
import { useAppDispatch } from "@/redux/hook";
import { setResults } from "@/redux/slices/searchResultsSlice";
import { saveResults } from "@/lib/resultsCache";
import { Info } from "lucide-react";

type Props = {
  token: string | undefined;
  outOfTokens: boolean;
};

type FormValues = {
  files: File[];
  postcode: string;
  coords: { lat: number; lng: number } | null;
  description?: string;
};

export default function FindProForm({ token, outOfTokens }: Props) {
  const { control, watch, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      files: [],
      postcode: "",
      coords: null,
      description: "",
    },
  });
  const [submitProblem, { isLoading }] = useSubmitProblemMutation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [isNavigating, setIsNavigating] = React.useState(false);

  const files = watch("files");
  const coords = watch("coords");
  const formDisabled = outOfTokens || isLoading;
  const canSubmit = files?.length > 0 && coords !== null;

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      const nextUrl =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      toast.error("Please log in to continue.");
      router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
      return;
    }

    if (outOfTokens) {
      toast.error(
        "You’re out of credits. Please buy tokens or upgrade to continue."
      );
      router.push("/pricing");
      return;
    }

    const formData = new FormData();

    if (data.files?.[0]) {
      formData.append("imageUrl", data.files[0]);
    }

    if (data.description) formData.append("description", data.description);
    if (data.postcode) formData.append("location", data.postcode);

    if (data.coords?.lat !== undefined && data.coords?.lat !== null) {
      formData.append("latitude", String(data.coords.lat));
    }
    if (data.coords?.lng !== undefined && data.coords?.lng !== null) {
      formData.append("longitude", String(data.coords.lng));
    }

    try {
      const res = await submitProblem({ data: formData }).unwrap();
      dispatch(setResults(res));
      saveResults(res);
      setIsNavigating(true);
      router.push("/results");
      router.refresh();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset
          disabled={formDisabled}
          aria-disabled={formDisabled}
          className="disabled:cursor-not-allowed"
        >
          {/* Files */}
          <Controller
            control={control}
            name="files"
            render={({ field: { value, onChange } }) => (
              <FileUploader
                files={value}
                onFilesChange={onChange}
                disabled={formDisabled}
                outOfTokens={outOfTokens}
              />
            )}
          />
          <div className="mt-6" />
          {/* Location */}
          <Controller
            control={control}
            name="postcode"
            render={({ field: { value, onChange } }) => (
              <Controller
                control={control}
                name="coords"
                render={({
                  field: { value: coordsVal, onChange: setCoords },
                }) => (
                  <LocationPicker
                    onPlaceSelected={({ details, inputText }) => {
                      const loc = details?.location ?? null;
                      console.log(loc);
                      setCoords(loc);
                      onChange(details?.formattedAddress ?? inputText ?? "");
                    }}
                    onCleared={() => {
                      setCoords(null);
                    }}
                  />
                )}
              />
            )}
          />
          <GetLeadsCTA
            disabled={outOfTokens || isLoading || !canSubmit}
            label={outOfTokens ? "Buy Tokens to Continue" : "Get 3 Leads"}
          />
        </fieldset>
      </form>
      {!canSubmit && (
        <div className="mt-2 md:mt-5 flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md text-sm w-full sm:w-auto">
          <Info size={16} className="mt-0.5" />
          <span>
            Upload a photo and select a location to enable get 3 leads.
          </span>
        </div>
      )}
      <SearchingOverlay
        open={isLoading || isNavigating}
        locationLabel={watch("postcode") || "your area"}
      />
    </>
  );
}
