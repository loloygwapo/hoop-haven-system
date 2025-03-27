
import { useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { PageTransition } from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { GAMES } from "@/data/mock-data";
import { Game } from "@/data/types";
import { Calendar, Trophy, Check, Clock } from "lucide-react";

export default function Schedule() {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Upcoming games (sorted by date)
  const upcomingGames = GAMES
    .filter(game => new Date(game.date) >= new Date() && game.status === "scheduled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Past games (sorted by date, most recent first)
  const pastGames = GAMES
    .filter(game => game.status === "completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group upcoming games by date
  const groupGamesByDate = (games: Game[]) => {
    const grouped: { [key: string]: Game[] } = {};
    
    games.forEach(game => {
      const key = game.date;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(game);
    });
    
    return grouped;
  };

  const upcomingGamesByDate = groupGamesByDate(upcomingGames);

  return (
    <MainLayout>
      <PageTransition>
        <div className="page-container">
          <div className="page-header">
            <h1>Game Schedule</h1>
            <p className="text-xl text-muted-foreground mt-2">
              View upcoming and past tournament games
            </p>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upcoming" className="gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Games
              </TabsTrigger>
              <TabsTrigger value="past" className="gap-2">
                <Trophy className="h-4 w-4" />
                Past Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="animate-fade-in">
              {Object.keys(upcomingGamesByDate).length > 0 ? (
                Object.entries(upcomingGamesByDate).map(([date, games]) => (
                  <div key={date} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {games.map((game) => (
                        <GameCard key={game.id} game={game} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No upcoming games</h3>
                  <p className="text-muted-foreground">Check back later for new game schedules</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="animate-fade-in">
              {pastGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastGames.map((game) => (
                    <GameResultCard key={game.id} game={game} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Trophy className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No past games</h3>
                  <p className="text-muted-foreground">Game results will appear here once games are completed</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
}

function GameCard({ game }: { game: Game }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 bg-muted/30 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {game.time}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {game.round}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {game.location.name}
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                  H
                </div>
                <span className="font-medium">{game.homeTeam.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <span className="font-medium">{game.awayTeam.name}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GameResultCard({ game }: { game: Game }) {
  if (!game.score) return null;
  
  const homeWon = game.score.home > game.score.away;
  const awayWon = game.score.away > game.score.home;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 bg-muted/30 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {new Date(game.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })} | {game.time}
            </span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {game.round}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {game.location.name}
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                  H
                </div>
                <span className={`font-medium ${homeWon ? "text-primary font-semibold" : ""}`}>
                  {game.homeTeam.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {homeWon && <Check className="h-4 w-4 text-primary" />}
                <span className="text-xl font-bold">{game.score.home}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <span className={`font-medium ${awayWon ? "text-primary font-semibold" : ""}`}>
                  {game.awayTeam.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {awayWon && <Check className="h-4 w-4 text-primary" />}
                <span className="text-xl font-bold">{game.score.away}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
