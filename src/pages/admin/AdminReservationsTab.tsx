
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RESERVATIONS } from "@/data/mock-data";
import { Reservation } from "@/data/types";
import { toast } from "sonner";
import { MapPin, Calendar, Clock, CheckCircle, XCircle, Calendar as CalendarIcon } from "lucide-react";

export function AdminReservationsTab() {
  const [reservations, setReservations] = useState<Reservation[]>(RESERVATIONS);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter reservations by status
  const filteredReservations = statusFilter === "all"
    ? reservations
    : reservations.filter(r => r.status === statusFilter);

  // Sort reservations by date, most recent first
  const sortedReservations = [...filteredReservations].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const updateReservationStatus = (reservationId: string, status: "approved" | "rejected" | "cancelled") => {
    setReservations(reservations.map(res => 
      res.id === reservationId ? { ...res, status } : res
    ));
    
    const statusMessages = {
      approved: "Reservation approved successfully",
      rejected: "Reservation rejected",
      cancelled: "Reservation cancelled",
    };
    
    toast.success(statusMessages[status]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Court Reservations</h2>
        <div className="w-full max-w-xs">
          <Label htmlFor="status-filter" className="mb-2 block">Filter by Status</Label>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reservations</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedReservations.length > 0 ? (
        <div className="space-y-4">
          {sortedReservations.map(reservation => (
            <Card key={reservation.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">{reservation.courtName}</span>
                    {reservation.status === "pending" && (
                      <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full">
                        Pending
                      </span>
                    )}
                    {reservation.status === "approved" && (
                      <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                        Approved
                      </span>
                    )}
                    {reservation.status === "rejected" && (
                      <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                        Rejected
                      </span>
                    )}
                    {reservation.status === "cancelled" && (
                      <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        Cancelled
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(reservation.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.startTime} - {reservation.endTime}</span>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div><span className="font-medium">User:</span> {reservation.userName}</div>
                    <div><span className="font-medium">Purpose:</span> {reservation.purpose}</div>
                    <div className="text-xs text-muted-foreground">
                      Requested: {new Date(reservation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-center">
                  {reservation.status === "pending" && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-500 border-green-500/20 hover:bg-green-500/10"
                        onClick={() => updateReservationStatus(reservation.id, "approved")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive"
                        onClick={() => updateReservationStatus(reservation.id, "rejected")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  {reservation.status === "approved" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-destructive"
                      onClick={() => updateReservationStatus(reservation.id, "cancelled")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <CalendarIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No reservations found</h3>
          <p className="text-muted-foreground">
            {statusFilter !== "all" 
              ? `There are no reservations with status "${statusFilter}"`
              : "No court reservations have been made yet"
            }
          </p>
        </div>
      )}
    </div>
  );
}
