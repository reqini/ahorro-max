import { Button } from "@/components/atoms"
import { WhatsAppIcon } from "@/components/atoms"
import { Download } from "lucide-react"

interface CTAGroupProps {
  whatsappUrl: string
  whatsappLabel: string
  downloadUrl: string
  downloadLabel: string
  variant?: "red" | "yellow"
}

export function CTAGroup({
  whatsappUrl,
  whatsappLabel,
  downloadUrl,
  downloadLabel,
  variant = "red",
}: CTAGroupProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        as="a"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="whatsapp"
        size="lg"
      >
        <WhatsAppIcon size={20} />
        {whatsappLabel}
      </Button>
      <Button
        as="a"
        href={downloadUrl}
        download
        variant={variant === "yellow" ? "primary" : "secondary"}
        size="lg"
      >
        <Download size={20} />
        {downloadLabel}
      </Button>
    </div>
  )
}
