
import { MainLayout } from "@/components/MainLayout";
import { PageTransition } from "@/components/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ANNOUNCEMENTS } from "@/data/mock-data";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { 
  MessageCircle, 
  PinIcon, 
  Calendar, 
  Trophy, 
  Bell, 
  Info 
} from "lucide-react";

export default function Announcements() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Filter announcements by category
  const filteredAnnouncements = categoryFilter === "all"
    ? ANNOUNCEMENTS
    : ANNOUNCEMENTS.filter(a => a.category === categoryFilter);

  // Sort announcements - pinned first, then by date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "general":
        return <Info className="h-4 w-4" />;
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

  return (
    <MainLayout>
      <PageTransition>
        <div className="page-container">
          <div className="page-header">
            <h1>Announcements</h1>
            <p className="text-xl text-muted-foreground mt-2">
              Stay updated with tournament news and information
            </p>
          </div>

          {/* Filter by category */}
          <div className="flex justify-end mb-6">
            <div className="w-full max-w-xs">
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="results">Results</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Announcements list */}
          <div className="space-y-6">
            {sortedAnnouncements.length > 0 ? (
              sortedAnnouncements.map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className={`hover:shadow-sm transition-shadow ${announcement.isPinned ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        {announcement.isPinned && (
                          <PinIcon className="h-4 w-4 text-primary" />
                        )}
                        {announcement.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                        {getCategoryIcon(announcement.category)}
                        <span className="capitalize">{announcement.category}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <p>{announcement.content}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <MessageCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No announcements found</h3>
                <p className="text-muted-foreground">
                  There are no announcements in this category
                </p>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
