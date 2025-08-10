import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

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
          src={contact.employee_photo_url}
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
        <Badge variant="default">{contact.industry}</Badge>
        <Badge variant="success">{contact.function}</Badge>
      </div>
    </article>
  )
}
