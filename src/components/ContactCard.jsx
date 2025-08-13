import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

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

export default function ContactCard({ contact, onOpen }) {
  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Открыть профиль: ${contact.employee_first_name_ru} ${contact.employee_last_name_ru}`}
      onClick={() => onOpen(contact)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(contact)}
      className="card p-6 hover:shadow-lg transition cursor-pointer relative"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-9 w-9"
        onClick={(e) => { e.stopPropagation(); onOpen(contact) }}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex flex-col">
        <img
          src={`/photos/${contact.employee_photo_file}`}
          alt={`${contact.employee_first_name_ru} ${contact.employee_last_name_ru}`}
          className="size-14 rounded-xl object-cover mb-4"
        />
        <div className="w-full">
          <h3 className="text-xl font-semibold mb-2">
            {contact.employee_first_name_ru} {contact.employee_last_name_ru}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2 leading-relaxed">
            {contact.employee_position_title}
          </p>
          {contact.company_url ? (
            <a 
              className="link text-sm mb-4 inline-block" 
              href={contact.company_url} 
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {contact.company_name_ru}
            </a>
          ) : (
            <span className="text-sm mb-4 inline-block text-zinc-600 dark:text-zinc-400">
              {contact.company_name_ru}
            </span>
          )}
        </div>
      </div>

      
    <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">{getIndustryCategory(contact.company_name_ru)}</Badge>
        <Badge variant="default">{getFunctionCategory(contact.employee_position_title)}</Badge>
      </div>
    </article>
  )
}
