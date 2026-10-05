import {ProviderContext, SettingsField} from "../types";

export const getSettingsSchema = async function ({
  providerContext,
}: {
  providerContext: ProviderContext;
}): Promise<SettingsField[]> {
  return [
    {
      key: "preferredQuality",
      type: "select",
      label: "Preferred audio quality",
      description: "The provider returns all qualities; this preference is informational for now.",
      options: [
        {label: "Auto / Best", value: "auto"},
        {label: "320 kbps", value: "320"},
        {label: "160 kbps", value: "160"},
        {label: "96 kbps", value: "96"},
        {label: "48 kbps", value: "48"},
      ],
      defaultValue: "auto",
    },
  ];
};
