"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Plus, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for skills
const initialSkills = [
  {
    id: "1",
    name: "Programming",
    category: "Technical",
    progress: 65,
    hoursSpent: 120,
    lastPracticed: "2023-03-15",
  },
  {
    id: "2",
    name: "Spanish",
    category: "Language",
    progress: 45,
    hoursSpent: 80,
    lastPracticed: "2023-03-14",
  },
  {
    id: "3",
    name: "Guitar",
    category: "Music",
    progress: 30,
    hoursSpent: 50,
    lastPracticed: "2023-03-10",
  },
]

export default function SkillsPage() {
  const { toast } = useToast()
  const [skills, setSkills] = useState(initialSkills)
  const [newSkillOpen, setNewSkillOpen] = useState(false)
  const [logSessionOpen, setLogSessionOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  // New skill form state
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState("")

  // Log session form state
  const [sessionHours, setSessionHours] = useState("1")
  const [sessionNotes, setSessionNotes] = useState("")

  const handleAddSkill = () => {
    if (!newSkillName.trim()) {
      toast({
        title: "Error",
        description: "Skill name is required",
        variant: "destructive",
      })
      return
    }

    const newSkill = {
      id: Date.now().toString(),
      name: newSkillName,
      category: newSkillCategory || "Other",
      progress: 0,
      hoursSpent: 0,
      lastPracticed: new Date().toISOString().split("T")[0],
    }

    setSkills([...skills, newSkill])
    setNewSkillName("")
    setNewSkillCategory("")
    setNewSkillOpen(false)

    toast({
      title: "Skill added",
      description: `${newSkillName} has been added to your skills`,
    })
  }

  const handleLogSession = () => {
    if (!selectedSkill) {
      toast({
        title: "Error",
        description: "Please select a skill",
        variant: "destructive",
      })
      return
    }

    const hours = Number.parseFloat(sessionHours)
    if (isNaN(hours) || hours <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid number of hours",
        variant: "destructive",
      })
      return
    }

    setSkills(
      skills.map((skill) => {
        if (skill.id === selectedSkill) {
          const newHoursSpent = skill.hoursSpent + hours
          // Calculate new progress (simplified)
          // In a real app, this would be more sophisticated
          const newProgress = Math.min(Math.floor(newHoursSpent / 2), 100)

          return {
            ...skill,
            hoursSpent: newHoursSpent,
            progress: newProgress,
            lastPracticed: new Date().toISOString().split("T")[0],
          }
        }
        return skill
      }),
    )

    setSessionHours("1")
    setSessionNotes("")
    setLogSessionOpen(false)

    toast({
      title: "Session logged",
      description: `${hours} hours added to your skill`,
    })
  }

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id))

    toast({
      title: "Skill deleted",
      description: "The skill has been removed from your list",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills Development</h1>
          <p className="text-muted-foreground">Track your progress in learning new skills</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={logSessionOpen} onOpenChange={setLogSessionOpen}>
            <DialogTrigger asChild>
              <Button>Log Session</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Practice Session</DialogTitle>
                <DialogDescription>Record time spent practicing a skill</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="skill">Skill</Label>
                  <Select value={selectedSkill || ""} onValueChange={setSelectedSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {skills.map((skill) => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hours">Hours Spent</Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={sessionHours}
                    onChange={(e) => setSessionHours(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Session Notes (Optional)</Label>
                  <Input
                    id="notes"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="What did you learn or practice?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleLogSession}>Log Session</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={newSkillOpen} onOpenChange={setNewSkillOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
                <DialogDescription>Add a new skill you want to track</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Skill Name</Label>
                  <Input
                    id="name"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="e.g., Programming, Spanish, Guitar"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Input
                    id="category"
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    placeholder="e.g., Technical, Language, Music"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddSkill}>Add Skill</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <Card key={skill.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{skill.name}</CardTitle>
                  <CardDescription>{skill.category}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteSkill(skill.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-medium">{skill.progress}%</span>
                  </div>
                  <Progress value={skill.progress} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Hours Spent</p>
                    <p className="text-lg font-medium">{skill.hoursSpent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Practiced</p>
                    <p className="text-lg font-medium">{new Date(skill.lastPracticed).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelectedSkill(skill.id)
                  setLogSessionOpen(true)
                }}
              >
                Log Practice
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

