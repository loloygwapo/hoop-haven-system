
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { COURTS, RESERVATIONS } from "@/data/mock-data";
import { TimeSlot } from "@/data/types";
import { useAuth } from "@/context/AuthContext";
import { MapPin, Calendar, Clock, CheckCircle, XCircle, Plus } from "lucide-react";

export default function Courts() {
  const { user } = useAuth();
  const [selectedCourt, setSelectedCourt] = useState(COURTS[0].id);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  
  // Get the selected court object
  const court = COURTS.find(c => c.id === selectedCourt);
  
  // Get all available dates for the selected court
  const availableDates = court
    ? Array.from(new Set(court.availableTimeSlots.map(slot => slot.date)))
    : [];
  
  // Auto-select the first date if none is selected
  if (court && availableDates.length > 0 && !selectedDate) {
    setSelectedDate(availableDates[0]);
  }
  
  // Get time slots for the selected date
  const timeSlots = court && selectedDate
    ? court.availableTimeSlots.filter(slot => slot.date === selectedDate)
    : [];

  // Get user's reservations
  const userReservations = user
    ? RESERVATIONS.filter(res => res.userId === user.id)
    : [];

  return (
    <MainLayout>
      <PageTransition>
        <div className="page-container">
          <div className="page-header">
            <h1>Basketball Courts</h1>
            <p className="text-xl text-muted-foreground mt-2">
              View courts and make reservations for practice or friendly matches
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column - Courts */}
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Available Courts</h2>
                  <div className="space-y-4">
                    {COURTS.map((court) => (
                      <Card 
                        key={court.id} 
                        className={`hover:shadow-sm transition-all cursor-pointer ${
                          selectedCourt === court.id ? "border-primary ring-1 ring-primary/20" : ""
                        }`}
                        onClick={() => {
                          setSelectedCourt(court.id);
                          setSelectedDate("");
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 text-primary">
                              <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{court.name}</h3>
                              <p className="text-sm text-muted-foreground">{court.address}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {user && userReservations.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Your Reservations</h2>
                    <div className="space-y-4">
                      {userReservations.map((reservation) => (
                        <Card key={reservation.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{reservation.courtName}</CardTitle>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{new Date(reservation.date).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{reservation.startTime} - {reservation.endTime}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-2">
                            <div className="flex items-center gap-1">
                              {reservation.status === 'approved' ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-xs text-green-500 font-medium">Approved</span>
                                </>
                              ) : reservation.status === 'pending' ? (
                                <>
                                  <Clock className="h-4 w-4 text-amber-500" />
                                  <span className="text-xs text-amber-500 font-medium">Pending Approval</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 text-destructive" />
                                  <span className="text-xs text-destructive font-medium">Cancelled</span>
                                </>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column - Time Slots */}
            <div className="lg:col-span-8">
              <Card>
                <CardHeader>
                  <CardTitle>{court?.name} Availability</CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                    <div className="w-full sm:w-auto">
                      <Label htmlFor="date">Select Date</Label>
                      <Select
                        value={selectedDate}
                        onValueChange={setSelectedDate}
                      >
                        <SelectTrigger id="date" className="w-full sm:w-[200px]">
                          <SelectValue placeholder="Select date" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDates.map((date) => (
                            <SelectItem key={date} value={date}>
                              {new Date(date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {timeSlots.map((slot) => (
                        <Card 
                          key={slot.id} 
                          className={`hover:shadow-sm transition-shadow ${
                            slot.isBooked ? "opacity-50" : "cursor-pointer"
                          }`}
                          onClick={() => {
                            if (!slot.isBooked && user) {
                              setSelectedTimeSlot(slot);
                              setIsReservationOpen(true);
                            } else if (!user) {
                              toast.error("Please login to make a reservation");
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex flex-col items-center text-center">
                              <div className="text-lg font-semibold mb-2">
                                {slot.startTime} - {slot.endTime}
                              </div>
                              {slot.isBooked ? (
                                <span className="text-sm text-destructive flex items-center gap-1">
                                  <XCircle className="h-4 w-4" />
                                  Booked
                                </span>
                              ) : (
                                <span className="text-sm text-primary flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4" />
                                  Available
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No date selected</h3>
                      <p className="text-muted-foreground">
                        Please select a date to view available time slots
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Reservation Dialog */}
          {selectedTimeSlot && (
            <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reserve Court</DialogTitle>
                  <DialogDescription>
                    Please fill out this form to reserve the court for your event.
                  </DialogDescription>
                </DialogHeader>
                
                <ReservationForm 
                  court={court!} 
                  date={selectedDate} 
                  timeSlot={selectedTimeSlot}
                  onClose={() => {
                    setIsReservationOpen(false);
                    setSelectedTimeSlot(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </PageTransition>
    </MainLayout>
  );
}

function ReservationForm({ 
  court, 
  date, 
  timeSlot, 
  onClose 
}: { 
  court: typeof COURTS[0], 
  date: string, 
  timeSlot: TimeSlot,
  onClose: () => void 
}) {
  const [purpose, setPurpose] = useState("");
  const [teamName, setTeamName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!purpose || !teamName || !contactNumber) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Reservation submitted successfully! It will be reviewed by the admin.");
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="bg-muted/30 p-4 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium">{court.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{timeSlot.startTime} - {timeSlot.endTime}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="teamName">Team/Group Name *</Label>
          <Input 
            id="teamName" 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
            placeholder="Enter your team or group name"
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="contactNumber">Contact Number *</Label>
          <Input 
            id="contactNumber" 
            value={contactNumber} 
            onChange={(e) => setContactNumber(e.target.value)} 
            placeholder="Enter a contact number"
            type="tel"
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="purpose">Purpose of Reservation *</Label>
          <Textarea 
            id="purpose" 
            value={purpose} 
            onChange={(e) => setPurpose(e.target.value)} 
            placeholder="What will you use the court for? (e.g., team practice, friendly game, etc.)"
            rows={3}
            required 
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Reservation"}
        </Button>
      </div>
    </form>
  );
}
