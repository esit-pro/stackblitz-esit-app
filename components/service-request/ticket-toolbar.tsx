"use client"

import { useState } from "react"
import {
  Archive,
  Clock,
  FileText,
  Flag,
  Folder,
  MoreHorizontal,
  Paperclip,
  Tag,
  Trash2,
  UserPlus,
  Users,
  Timer,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function ServiceTicketToolbar() {
  const [isTimerActive, setIsTimerActive] = useState(false)

  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-full bg-background border rounded-lg p-1 shadow-sm">
        <div className="flex items-center flex-wrap gap-1">
          {/* Time tracking section */}
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsTimerActive(!isTimerActive)}
                  className={isTimerActive ? "text-green-500" : ""}
                >
                  <Timer className="h-4 w-4" />
                  <span className="sr-only">Time tracking</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isTimerActive ? "Stop timer" : "Start timer"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Clock className="h-4 w-4" />
                  <span className="sr-only">Time log</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View time log</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Assignment section */}
          <div className="flex items-center">
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Users className="h-4 w-4" />
                      <span className="sr-only">Assign client</span>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assign to client</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Assign to client</h4>
                  <div className="grid gap-1">
                    <Button variant="ghost" size="sm" className="justify-start">
                      Acme Corp
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Globex Industries
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Stark Enterprises
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <UserPlus className="h-4 w-4" />
                      <span className="sr-only">Assign team member</span>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assign to team member</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Assign to team member</h4>
                  <div className="grid gap-1">
                    <Button variant="ghost" size="sm" className="justify-start">
                      Alex Johnson
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Maria Garcia
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Sam Taylor
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Ticket properties section */}
          <div className="flex items-center">
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Tag className="h-4 w-4" />
                      <span className="sr-only">Ticket status</span>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change ticket status</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Change status</h4>
                  <div className="grid gap-1">
                    <Button variant="ghost" size="sm" className="justify-start">
                      Open
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      In Progress
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Pending
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Resolved
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Closed
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Flag className="h-4 w-4" />
                      <span className="sr-only">Set priority</span>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Set priority</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Set priority</h4>
                  <div className="grid gap-1">
                    <Button variant="ghost" size="sm" className="justify-start">
                      Low
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Medium
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      High
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Urgent
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Folder className="h-4 w-4" />
                      <span className="sr-only">Categorize</span>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Categorize ticket</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-56 p-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Select category</h4>
                  <div className="grid gap-1">
                    <Button variant="ghost" size="sm" className="justify-start">
                      Hardware
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Software
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Network
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Security
                    </Button>
                    <Button variant="ghost" size="sm" className="justify-start">
                      Account
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Content section */}
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">Add notes</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add notes</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attachments</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Manage attachments</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="ml-auto flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Archive className="h-4 w-4" />
                  <span className="sr-only">Archive</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Archive ticket</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete ticket</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>Merge tickets</DropdownMenuItem>
                <DropdownMenuItem>Convert to knowledge base</DropdownMenuItem>
                <DropdownMenuItem>Create template</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Export ticket</DropdownMenuItem>
                <DropdownMenuItem>Print ticket</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}