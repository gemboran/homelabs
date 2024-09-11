import {Loader2} from "lucide-react";

export const LoadingIcon = ({loading}: { loading: boolean }) => {
  if (!loading) return null
  return <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
}