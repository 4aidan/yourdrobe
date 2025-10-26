import { useState } from "react";
import { Outfit } from "@/types/wardrobe";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CalendarViewProps {
  outfits: Outfit[];
  onSelectOutfit: (outfit: Outfit) => void;
}

export function CalendarView({ outfits, onSelectOutfit }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const getOutfitsForDate = (date: string): Outfit[] => {
    return outfits.filter((outfit) => outfit.scheduledDate === date);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const days = generateCalendarDays();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const selectedDateOutfits = selectedDate ? getOutfitsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={goToPreviousMonth}
          variant="ghost"
          size="sm"
          className="h-9 hover:bg-black hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-bold">{formatMonthYear(currentDate)}</h3>
        <Button
          onClick={goToNextMonth}
          variant="ghost"
          size="sm"
          className="h-9 hover:bg-black hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="border-2 border-black">
        <CardContent className="p-4">
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-muted-foreground py-2 uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateString = formatDate(day);
              const dayOutfits = getOutfitsForDate(dateString);
              const hasOutfits = dayOutfits.length > 0;
              const today = isToday(day);

              return (
                <button
                  key={dateString}
                  onClick={() => hasOutfits && setSelectedDate(dateString)}
                  className={`aspect-square border-2 p-1 text-sm transition-all font-medium ${
                    today
                      ? "bg-black text-white border-black"
                      : hasOutfits
                      ? "border-black hover:bg-black hover:text-white cursor-pointer"
                      : "border-gray-200 hover:border-black"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{day.getDate()}</span>
                    {hasOutfits && (
                      <div className="flex gap-0.5 mt-1">
                        {dayOutfits.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 ${
                              today ? "bg-white" : "bg-black"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-2 border-black">
          <CardContent className="p-4">
            <p className="text-3xl font-bold">{outfits.filter(o => o.scheduledDate).length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Scheduled Outfits</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-black">
          <CardContent className="p-4">
            <p className="text-3xl font-bold">
              {new Set(outfits.filter(o => o.scheduledDate).map(o => o.scheduledDate)).size}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Days Planned</p>
          </CardContent>
        </Card>
      </div>

      {/* Day Outfits Dialog */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="border-2 border-black shadow-brutal bg-white">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">
              {selectedDate && new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedDateOutfits.length} outfit{selectedDateOutfits.length !== 1 ? "s" : ""} planned
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {selectedDateOutfits.map((outfit) => (
              <button
                key={outfit.id}
                onClick={() => {
                  onSelectOutfit(outfit);
                  setSelectedDate(null);
                }}
                className="w-full border-2 border-black p-3 hover:bg-black hover:text-white transition-colors text-left"
              >
                <div className="flex gap-3">
                  <div className="grid grid-cols-2 gap-1 w-20 h-20 flex-shrink-0 border-2 border-black">
                    {outfit.items.slice(0, 4).map((item, idx) => (
                      <div key={item.id} className={`overflow-hidden ${idx < 2 ? 'border-b' : ''} ${idx % 2 === 0 ? 'border-r' : ''} border-black`}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{outfit.name}</h4>
                    <p className="text-xs opacity-70">
                      {outfit.items.length} items • Worn {outfit.timesWorn}×
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}