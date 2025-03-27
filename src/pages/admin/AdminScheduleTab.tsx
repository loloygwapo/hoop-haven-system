
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GAMES, TEAMS, COURTS } from "@/data/mock-data";
import { Game } from "@/data/types";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Edit, Trash2, Plus } from "lucide-react";

export function AdminScheduleTab() {
  const [games, setGames] = useState<Game[]>(GAMES);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [isEditGameOpen, setIsEditGameOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const deleteGame = (gameId: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      setGames(games.filter(g => g.id !== gameId));
      toast.success("Game deleted successfully");
    }
  };

  const editGame = (game: Game) => {
    setSelectedGame(game);
    setIsEditGameOpen(true);
  };

  // Group games by date
  const gamesByDate: Record<string, Game[]> = games.reduce((acc, game) => {
    if (!acc[game.date]) {
      acc[game.date] = [];
    }
    acc[game.date].push(game);
    return acc;
  }, {} as Record<string, Game[]>);

  // Sort dates chronologically
  const sortedDates = Object.keys(gamesByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Game Schedule</h2>
        <Button onClick={() => setIsAddGameOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Game
        </Button>
      </div>

      {sortedDates.length > 0 ? (
        sortedDates.map(date => (
          <div key={date} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className="space-y-4">
              {gamesByDate[date].map(game => (
                <Card key={game.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{game.time}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {game.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{game.location.name}</span>
                      </div>
                      <div className="font-semibold">
                        {game.homeTeam.name} vs {game.awayTeam.name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => editGame(game)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteGame(game.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No games scheduled</h3>
          <p className="text-muted-foreground mb-4">
            Click the button below to add your first game
          </p>
          <Button onClick={() => setIsAddGameOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Game
          </Button>
        </div>
      )}

      {/* Add Game Dialog */}
      <Dialog open={isAddGameOpen} onOpenChange={setIsAddGameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Game</DialogTitle>
            <DialogDescription>
              Schedule a new game for the tournament
            </DialogDescription>
          </DialogHeader>
          <GameForm
            onClose={() => setIsAddGameOpen(false)}
            onSubmit={(game) => {
              setGames([...games, { ...game, id: `game-${Date.now()}` }]);
              toast.success("Game added successfully");
              setIsAddGameOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Game Dialog */}
      <Dialog open={isEditGameOpen} onOpenChange={setIsEditGameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Game</DialogTitle>
            <DialogDescription>
              Update the game details
            </DialogDescription>
          </DialogHeader>
          {selectedGame && (
            <GameForm
              game={selectedGame}
              onClose={() => {
                setIsEditGameOpen(false);
                setSelectedGame(null);
              }}
              onSubmit={(updatedGame) => {
                setGames(games.map(g => g.id === selectedGame.id ? { ...updatedGame, id: selectedGame.id } : g));
                toast.success("Game updated successfully");
                setIsEditGameOpen(false);
                setSelectedGame(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface GameFormProps {
  game?: Game;
  onClose: () => void;
  onSubmit: (game: Omit<Game, "id">) => void;
}

function GameForm({ game, onClose, onSubmit }: GameFormProps) {
  const [homeTeam, setHomeTeam] = useState(game?.homeTeam.id || "");
  const [awayTeam, setAwayTeam] = useState(game?.awayTeam.id || "");
  const [date, setDate] = useState(game?.date || "");
  const [time, setTime] = useState(game?.time || "");
  const [court, setCourt] = useState(game?.location.id || "");
  const [round, setRound] = useState(game?.round || "Group Stage");
  const [status, setStatus] = useState(game?.status || "scheduled");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!homeTeam || !awayTeam || !date || !time || !court || !round || !status) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (homeTeam === awayTeam) {
      toast.error("Home team and away team cannot be the same");
      return;
    }
    
    setIsSubmitting(true);
    
    const selectedHomeTeam = TEAMS.find(t => t.id === homeTeam);
    const selectedAwayTeam = TEAMS.find(t => t.id === awayTeam);
    const selectedCourt = COURTS.find(c => c.id === court);
    
    if (!selectedHomeTeam || !selectedAwayTeam || !selectedCourt) {
      toast.error("Invalid selection");
      setIsSubmitting(false);
      return;
    }
    
    // Create new game object
    const newGame: Omit<Game, "id"> = {
      homeTeam: selectedHomeTeam,
      awayTeam: selectedAwayTeam,
      date,
      time,
      location: selectedCourt,
      status: status as any,
      round,
    };
    
    // If game is marked as completed, add a score
    if (status === "completed") {
      newGame.score = game?.score || {
        home: Math.floor(Math.random() * 30) + 70,
        away: Math.floor(Math.random() * 30) + 70,
      };
    }
    
    onSubmit(newGame);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="homeTeam">Home Team *</Label>
          <Select
            value={homeTeam}
            onValueChange={setHomeTeam}
          >
            <SelectTrigger id="homeTeam">
              <SelectValue placeholder="Select home team" />
            </SelectTrigger>
            <SelectContent>
              {TEAMS.map(team => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="awayTeam">Away Team *</Label>
          <Select
            value={awayTeam}
            onValueChange={setAwayTeam}
          >
            <SelectTrigger id="awayTeam">
              <SelectValue placeholder="Select away team" />
            </SelectTrigger>
            <SelectContent>
              {TEAMS.map(team => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="court">Court *</Label>
        <Select
          value={court}
          onValueChange={setCourt}
        >
          <SelectTrigger id="court">
            <SelectValue placeholder="Select court" />
          </SelectTrigger>
          <SelectContent>
            {COURTS.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="round">Round *</Label>
          <Select
            value={round}
            onValueChange={setRound}
          >
            <SelectTrigger id="round">
              <SelectValue placeholder="Select round" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Group Stage">Group Stage</SelectItem>
              <SelectItem value="Quarterfinals">Quarterfinals</SelectItem>
              <SelectItem value="Semifinals">Semifinals</SelectItem>
              <SelectItem value="Finals">Finals</SelectItem>
              <SelectItem value="Exhibition">Exhibition</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="status">Status *</Label>
          <Select
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : game ? "Update Game" : "Add Game"}
        </Button>
      </div>
    </form>
  );
}
