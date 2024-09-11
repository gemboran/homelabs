import {Separator} from "@/components/ui/separator";

export default async function AccountsSettingsPage() {
  return <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">Display</h3>
      <p className="text-sm text-muted-foreground">
        Turn items on or off to control what&apos;s displayed in the app.
      </p>
    </div>
    <Separator/>
  </div>
}