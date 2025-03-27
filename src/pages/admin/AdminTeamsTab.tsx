
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEAMS } from "@/data/mock-data";
import { Team, Player } from "@/data/types";
import { toast } from "sonner";
import { Users, UserRound, Edit, Trash2, Plus, Search } from "lucide-react";

export function AdminTeamsTab() {
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter teams by search query
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.coach.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteTeam = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      setTeams(teams.filter(t => t.id !== teamId));
      toast.success("Team deleted successfully");
    }
  };

  const editTeam = (team: Team) => {
    setSelectedTeam(team);
    setIsEditTeamOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Teams</h2>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setIsAddTeamOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Team
          </Button>
        </div>
      </div>

      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map(team => (
            <Card key={team.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => editTeam(team)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteTeam(team.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{team.name}</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  <div>Coach: {team.coach}</div>
                  <div>Contact: {team.contactNumber}</div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Players ({team.players.length})</div>
                  <div className="flex flex-wrap gap-1">
                    {team.players.slice(0, 8).map((player) => (
                      <div 
                        key={player.id} 
                        className="bg-muted px-2 py-1 rounded-md text-xs"
                      >
                        #{player.jerseyNumber} {player.name}
                      </div>
                    ))}
                    {team.players.length > 8 && (
                      <div className="bg-primary/10 px-2 py-1 rounded-md text-xs text-primary">
                        +{team.players.length - 8} more
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No teams found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try a different search term" : "Click the button below to add a team"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddTeamOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team
            </Button>
          )}
        </div>
      )}

      {/* Add Team Dialog */}
      <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Team</DialogTitle>
            <DialogDescription>
              Register a new team for the tournament
            </DialogDescription>
          </DialogHeader>
          <TeamForm
            onClose={() => setIsAddTeamOpen(false)}
            onSubmit={(team) => {
              setTeams([...teams, { ...team, id: `team-${Date.now()}` }]);
              toast.success("Team added successfully");
              setIsAddTeamOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditTeamOpen} onOpenChange={setIsEditTeamOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update the team details
            </DialogDescription>
          </DialogHeader>
          {selectedTeam && (
            <TeamForm
              team={selectedTeam}
              onClose={() => {
                setIsEditTeamOpen(false);
                setSelectedTeam(null);
              }}
              onSubmit={(updatedTeam) => {
                setTeams(teams.map(t => 
                  t.id === selectedTeam.id ? { ...updatedTeam, id: selectedTeam.id } : t
                ));
                toast.success("Team updated successfully");
                setIsEditTeamOpen(false);
                setSelectedTeam(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface TeamFormProps {
  team?: Team;
  onClose: () => void;
  onSubmit: (team: Omit<Team, "id">) => void;
}

function TeamForm({ team, onClose, onSubmit }: TeamFormProps) {
  const [name, setName] = useState(team?.name || "");
  const [coach, setCoach] = useState(team?.coach || "");
  const [contactNumber, setContactNumber] = useState(team?.contactNumber || "");
  const [players, setPlayers] = useState<Array<{
    id?: string;
    name: string;
    jerseyNumber: string;
    position: string;
    age: string;
  }>>(
    team
      ? team.players.map(p => ({
          id: p.id,
          name: p.name,
          jerseyNumber: p.jerseyNumber.toString(),
          position: p.position,
          age: p.age.toString(),
        }))
      : Array(5).fill({
          name: "",
          jerseyNumber: "",
          position: "",
          age: "",
        })
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatePlayer = (
    index: number,
    field: "name" | "jerseyNumber" | "position" | "age",
    value: string
  ) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setPlayers(newPlayers);
  };

  const addPlayerField = () => {
    if (players.length < 15) {
      setPlayers([
        ...players,
        { name: "", jerseyNumber: "", position: "", age: "" },
      ]);
    }
  };

  const removePlayerField = (index: number) => {
    if (players.length > 5) {
      const newPlayers = [...players];
      newPlayers.splice(index, 1);
      setPlayers(newPlayers);
    } else {
      toast.error("Team must have at least 5 players");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !coach || !contactNumber) {
      toast.error("Please fill in all required team fields");
      return;
    }

    // Validate players
    const validPlayers = players.filter(
      (p) => p.name && p.jerseyNumber && p.position && p.age
    );
    if (validPlayers.length < 5) {
      toast.error("You need at least 5 players with all fields completed");
      return;
    }

    setIsSubmitting(true);

    // Format players for submission
    const formattedPlayers: Player[] = validPlayers.map((p, index) => ({
      id: p.id || `player-${Date.now()}-${index}`,
      name: p.name,
      jerseyNumber: parseInt(p.jerseyNumber),
      position: p.position,
      age: parseInt(p.age),
    }));

    // Create team object
    const newTeam: Omit<Team, "id"> = {
      name,
      coach,
      contactNumber,
      players: formattedPlayers,
      createdAt: team?.createdAt || new Date().toISOString(),
    };

    onSubmit(newTeam);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Team Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="coach">Coach Name *</Label>
            <Input
              id="coach"
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
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
            <Plus className="h-4 w-4 mr-1" />
            Add Player
          </Button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {players.map((player, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4">
                <Input
                  placeholder="Player name"
                  value={player.name}
                  onChange={(e) => updatePlayer(index, "name", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  placeholder="Number"
                  value={player.jerseyNumber}
                  onChange={(e) => updatePlayer(index, "jerseyNumber", e.target.value)}
                  type="number"
                  min="0"
                  max="99"
                />
              </div>
              <div className="col-span-3">
                <Input
                  placeholder="Position"
                  value={player.position}
                  onChange={(e) => updatePlayer(index, "position", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  placeholder="Age"
                  value={player.age}
                  onChange={(e) => updatePlayer(index, "age", e.target.value)}
                  type="number"
                  min="15"
                  max="60"
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {players.length > 5 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePlayerField(index)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : team ? "Update Team" : "Add Team"}
        </Button>
      </div>
    </form>
  );
}
