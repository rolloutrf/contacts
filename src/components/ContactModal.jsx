import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

function getIndustryCategory(companyName) {
  const name = companyName.toLowerCase();
  if (name.includes("банк") || name.includes("money") || name.includes("fintech") || name.includes("paypal") || name.includes("revolut")) return "Банки";
  if (name.includes("авито")) return "IT";
  if (name.includes("газпром")) return "Энергетика";
  if (name.includes("мтс")) return "Телеком";
  if (name.includes("яндекс")) return "IT";
  if (name.includes("озон")) return "E-commerce";
  if (name.includes("самолет")) return "Недвижимость";
  return "Другое";
}

function getFunctionCategory(positionTitle) {
  const title = positionTitle.toLowerCase();
  if (title.includes("product") || title.includes("owner") || title.includes("manager")) return "Product";
  if (title.includes("design") || title.includes("designer") || title.includes("art-director") || title.includes("ux") || title.includes("ui") || title.includes("illustrator")) return "Design";
  if (title.includes("developer") || title.includes("engineer") || title.includes("cto") || title.includes("architect") || title.includes("frontend") || title.includes("backend") || title.includes("data scientist")) return "Development";
  if (title.includes("marketing")) return "Marketing";
  if (title.includes("hr")) return "HR";
  if (title.includes("ceo") || title.includes("president") || title.includes("founder")) return "CEO";
  return "Other";
}

export default function ContactModal({ contact, onClose, open }) {
  if (!contact) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[540px] !rounded-[32px] dark:border-none [&>button]:border-none [&>button]:bg-transparent [&>button]:hover:bg-transparent [&>button]:shadow-none [&>button]:ring-0 [&>button]:outline-none [&>button]:focus:ring-0 [&>button]:focus:outline-none">
        <DialogHeader>
          <DialogTitle className="sr-only">Контакт</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-6">
          <img
            src={`/photos/${contact.employee_photo_file}`}
            alt="Avatar"
            className="size-28 rounded-3xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 mb-2">
              <Badge variant="secondary">{getIndustryCategory(contact.company_name_ru)}</Badge>
              <Badge variant="default">{getFunctionCategory(contact.employee_position_title)}</Badge>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
              {contact.employee_first_name_ru} {contact.employee_last_name_ru}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              {contact.employee_position_title}
            </p>
            {contact.company_url ? (
              <a 
                href={contact.company_url} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 dark:text-zinc-400 underline mt-2 inline-block hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                {contact.company_name_ru}
              </a>
            ) : (
              <span className="text-zinc-500 dark:text-zinc-400 mt-2 inline-block">
                {contact.company_name_ru}
              </span>
            )}
          </div>
        </div>

        {contact['employee_facebook.link'] && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-3">Контакты</h3>
            <div className="flex flex-col gap-y-2">
              <Row 
                label="Facebook" 
                value={contact['employee_facebook.link']} 
                isLink={true}
              />
            </div>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute -bottom-24 right-8 size-56 rounded-full blur-3xl bg-red-400/30"
        />
      </DialogContent>
    </Dialog>
  )
}

function Row({label, value, isLink = false}){
  const getDisplayText = (url) => {
    if (label === "Facebook") {
      // Извлекаем username из Facebook URL
      const match = url.match(/facebook\.com\/(.+?)(?:\?|$|\/)/);
      return match ? `@${match[1]}` : url;
    }
    // Для других ссылок показываем полный URL, но с ограничением длины
    return url.length > 40 ? `${url.substring(0, 40)}...` : url;
  };

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-zinc-500 dark:text-zinc-400">{label}:</span>
      {isLink ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-medium text-zinc-900 dark:text-zinc-200 hover:underline"
        >
          {getDisplayText(value)}
        </a>
      ) : (
        <span className="font-medium dark:text-zinc-200">{value}</span>
      )}
    </div>
  )
}
