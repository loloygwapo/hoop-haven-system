
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ANNOUNCEMENTS } from "@/data/mock-data";
import { Announcement } from "@/data/types";
import { toast } from "sonner";
import { MessageCircle, Calendar, Trophy, Bell, Edit, Trash2, Plus, PinIcon } from "lucide-react";
import { format } from "date-fns";

export function AdminAnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const deleteAnnouncement = (announcementId: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter(a => a.id !== announcementId));
      toast.success("Announcement deleted successfully");
    }
  };

  const editAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsEditAnnouncementOpen(true);
  };

  const togglePin = (announcementId: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === announcementId ? { ...a, isPinned: !a.isPinned } : a
    ));
    toast.success("Announcement updated");
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "general":
        return <MessageCircle className="h-4 w-4" />;
      case "schedule":
        return <Calendar className="h-4 w-4" />;
      case "results":
        return <Trophy className="h-4 w-4" />;
      case "important":
        return <Bell className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  // Sort announcements - pinned first, then by date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Announcements</h2>
        <Button onClick={() => setIsAddAnnouncementOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Announcement
        </Button>
      </div>

      {sortedAnnouncements.length > 0 ? (
        <div className="space-y-4">
          {sortedAnnouncements.map(announcement => (
            <Card key={announcement.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{announcement.title}</h3>
                    {announcement.isPinned && (
                      <PinIcon className="h-4 w-4 text-primary" />
                    )}
                    <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full ml-auto md:ml-2">
                      {getCategoryIcon(announcement.category)}
                      <span className="capitalize">{announcement.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Posted: {format(new Date(announcement.createdAt), "PPP")}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button size="sm" variant="outline" onClick={() => togglePin(announcement.id)}>
                    <PinIcon className="h-4 w-4 mr-1" />
                    {announcement.isPinned ? "Unpin" : "Pin"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => editAnnouncement(announcement)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteAnnouncement(announcement.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No announcements yet</h3>
          <p className="text-muted-foreground mb-4">
            Click the button below to create your first announcement
          </p>
          <Button onClick={() => setIsAddAnnouncementOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Announcement
          </Button>
        </div>
      )}

      {/* Add Announcement Dialog */}
      <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement for the tournament
            </DialogDescription>
          </DialogHeader>
          <AnnouncementForm
            onClose={() => setIsAddAnnouncementOpen(false)}
            onSubmit={(announcement) => {
              setAnnouncements([
                ...announcements, 
                { 
                  ...announcement, 
                  id: `ann-${Date.now()}`,
                  createdBy: "admin",
                  createdAt: new Date().toISOString(),
                }
              ]);
              toast.success("Announcement added successfully");
              setIsAddAnnouncementOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditAnnouncementOpen} onOpenChange={setIsEditAnnouncementOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update the announcement details
            </DialogDescription>
          </DialogHeader>
          {selectedAnnouncement && (
            <AnnouncementForm
              announcement={selectedAnnouncement}
              onClose={() => {
                setIsEditAnnouncementOpen(false);
                setSelectedAnnouncement(null);
              }}
              onSubmit={(updatedAnnouncement) => {
                setAnnouncements(announcements.map(a => 
                  a.id === selectedAnnouncement.id 
                    ? { 
                        ...updatedAnnouncement, 
                        id: selectedAnnouncement.id,
                        createdBy: selectedAnnouncement.createdBy,
                        createdAt: selectedAnnouncement.createdAt,
                      } 
                    : a
                ));
                toast.success("Announcement updated successfully");
                setIsEditAnnouncementOpen(false);
                setSelectedAnnouncement(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface AnnouncementFormProps {
  announcement?: Announcement;
  onClose: () => void;
  onSubmit: (announcement: Pick<Announcement, "title" | "content" | "category" | "isPinned">) => void;
}

function AnnouncementForm({ announcement, onClose, onSubmit }: AnnouncementFormProps) {
  const [title, setTitle] = useState(announcement?.title || "");
  const [content, setContent] = useState(announcement?.content || "");
  const [category, setCategory] = useState(announcement?.category || "general");
  const [isPinned, setIsPinned] = useState(announcement?.isPinned || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    onSubmit({
      title,
      content,
      category: category as any,
      isPinned,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter announcement title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter announcement content"
          rows={5}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={category}
            onValueChange={setCategory as any}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="schedule">Schedule</SelectItem>
              <SelectItem value="results">Results</SelectItem>
              <SelectItem value="important">Important</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end pb-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="pinned"
              checked={isPinned}
              onCheckedChange={setIsPinned}
            />
            <Label htmlFor="pinned" className="cursor-pointer">Pin Announcement</Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : announcement ? "Update Announcement" : "Add Announcement"}
        </Button>
      </div>
    </form>
  );
}
