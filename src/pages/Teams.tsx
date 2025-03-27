
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEAMS } from "@/data/mock-data";
import { Team, Player } from "@/data/types";
import { useAuth } from "@/context/AuthContext";
import { Users, UserRound, Search } from "lucide-react";
import { toast } from "sonner";

export default function Teams() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Filter teams by search query
  const filteredTeams = TEAMS.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.coach.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <PageTransition>
        <div className="page-container">
          <div className="page-header">
            <h1>Teams</h1>
            <p className="text-xl text-muted-foreground mt-2">
              View all participating teams and their players
            </p>
          </div>

          {/* Team actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {user && (
              <Button onClick={() => setIsRegisterOpen(true)}>
                <Users className="mr-2 h-4 w-4" />
                Register a Team
              </Button>
            )}
          </div>

          {/* Teams grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <TeamCard 
                  key={team.id} 
                  team={team} 
                  onClick={() => setSelectedTeam(team)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No teams found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try a different search term" : "No teams have registered yet"}
                </p>
              </div>
            )}
          </div>

          {/* Team detail dialog */}
          <Dialog open={!!selectedTeam} onOpenChange={(open) => !open && setSelectedTeam(null)}>
            {selectedTeam && (
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedTeam.name}</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                      <div>
                        <span className="text-sm font-medium">Coach:</span>{" "}
                        <span>{selectedTeam.coach}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Contact:</span>{" "}
                        <span>{selectedTeam.contactNumber}</span>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="players">
                  <TabsList>
                    <TabsTrigger value="players" className="gap-2">
                      <Users className="h-4 w-4" />
                      Players ({selectedTeam.players.length})
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="players" className="animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {selectedTeam.players.map((player) => (
                        <PlayerCard key={player.id} player={player} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            )}
          </Dialog>

          {/* Team registration form */}
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Team</DialogTitle>
                <DialogDescription>
                  Fill out the form below to register your team for the tournament.
                </DialogDescription>
              </DialogHeader>
              
              <TeamRegistrationForm onClose={() => setIsRegisterOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </PageTransition>
    </MainLayout>
  );
}

function TeamCard({ team, onClick }: { team: Team; onClick: () => void }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-1">{team.name}</h3>
          <p className="text-muted-foreground mb-4">Coach: {team.coach}</p>
          <div className="flex -space-x-2">
            {team.players.slice(0, 5).map((player, idx) => (
              <div 
                key={player.id} 
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background"
              >
                {player.jerseyNumber}
              </div>
            ))}
            {team.players.length > 5 && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium border-2 border-background">
                +{team.players.length - 5}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 border-t flex justify-center">
        <Button variant="ghost" size="sm">View Team Details</Button>
      </CardFooter>
    </Card>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="flex items-center p-3 bg-card rounded-lg border">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold mr-3">
        {player.jerseyNumber}
      </div>
      <div>
        <p className="font-medium">{player.name}</p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{player.position}</span>
          <span>{player.age} years</span>
          {player.height && <span>{player.height}</span>}
        </div>
      </div>
    </div>
  );
}

function TeamRegistrationForm({ onClose }: { onClose: () => void }) {
  const [teamName, setTeamName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [players, setPlayers] = useState<Array<{ name: string; number: string }>>([
    { name: "", number: "" },
    { name: "", number: "" },
    { name: "", number: "" },
    { name: "", number: "" },
    { name: "", number: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatePlayer = (index: number, field: "name" | "number", value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const addPlayerField = () => {
    if (players.length < 15) {
      setPlayers([...players, { name: "", number: "" }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!teamName || !coachName || !contactNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate at least 5 players
    const validPlayers = players.filter(p => p.name && p.number);
    if (validPlayers.length < 5) {
      toast.error("You need at least 5 players to register a team");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Team registered successfully! It will be reviewed by the admin.");
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="teamName">Team Name *</Label>
          <Input 
            id="teamName" 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="coachName">Coach Name *</Label>
            <Input 
              id="coachName" 
              value={coachName} 
              onChange={(e) => setCoachName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <Label htmlFor="contactNumber">Contact Number *</Label>
            <Input 
              id="contactNumber" 
              value={contactNumber} 
              onChange={(e) => setContactNumber(e.target.value)} 
              type="tel"
              required 
            />
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Players (minimum 5) *</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addPlayerField}
            disabled={players.length >= 15}
          >
            Add Player
          </Button>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {players.map((player, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 items-center">
              <div className="col-span-2">
                <Input 
                  placeholder="Player name"
                  value={player.name}
                  onChange={(e) => updatePlayer(index, "name", e.target.value)}
                />
              </div>
              <div>
                <Input 
                  placeholder="Number"
                  value={player.number}
                  onChange={(e) => updatePlayer(index, "number", e.target.value)}
                  type="number"
                  min="0"
                  max="99"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Register Team"}
        </Button>
      </div>
    </form>
  );
}
