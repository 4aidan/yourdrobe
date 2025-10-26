import { ClothingItem } from "@/types/wardrobe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Palette, Tag, ExternalLink, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface AnalyticsViewProps {
  clothes: ClothingItem[];
  onRemove: (id: string) => void;
}

export function AnalyticsView({ clothes }: AnalyticsViewProps) {
  // Most worn items
  const mostWorn = [...clothes]
    .sort((a, b) => b.timesWorn - a.timesWorn)
    .slice(0, 5);

  // Least worn items for resale
  const today = new Date();
  const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);
  
  const leastWorn = clothes
    .filter((item) => {
      if (item.timesWorn <= 2) return true;
      if (!item.lastWorn) return true;
      const lastWornDate = new Date(item.lastWorn);
      return lastWornDate < sixtyDaysAgo;
    })
    .sort((a, b) => a.timesWorn - b.timesWorn)
    .slice(0, 5);

  // Color distribution
  const colorCounts = clothes.reduce((acc, item) => {
    acc[item.color] = (acc[item.color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topColors = Object.entries(colorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Category distribution
  const categoryCounts = clothes.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Total stats
  const totalItems = clothes.length;
  const totalWears = clothes.reduce((sum, item) => sum + item.timesWorn, 0);
  const avgWears = totalItems > 0 ? (totalWears / totalItems).toFixed(1) : 0;

  const estimatedValue = (item: ClothingItem) => {
    const baseValues: Record<string, number> = {
      formal: 40,
      casual: 20,
      sports: 25,
      loungewear: 15,
    };
    return baseValues[item.category] || 20;
  };

  const handleSellOnDepop = (item: ClothingItem) => {
    // TODO: Add call to AI fashion describer here
    window.open("https://www.depop.com/sell/", "_blank");
    toast.success(`Opening Depop to sell "${item.name}"`);
  };

  const handleSellOnVinted = (item: ClothingItem) => {
    // TODO: Add call to AI fashion describer here
    window.open("https://www.vinted.com/catalog/new", "_blank");
    toast.success(`Opening Vinted to sell "${item.name}"`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Analytics & Resale</h2>
        <p className="text-sm text-muted-foreground">Insights and selling opportunities</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-2 border-black">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalItems}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Wears</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalWears}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Avg Wears</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{avgWears}</p>
          </CardContent>
        </Card>
      </div>

      {/* Most Worn Items */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <TrendingUp className="w-5 h-5" />
            Most Worn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mostWorn.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b-2 border-black last:border-0 last:pb-0">
                <span className="text-3xl font-bold text-gray-200 w-10">#{index + 1}</span>
                <div className="w-16 h-16 border-2 border-black overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                </div>
                <span className="text-xl font-bold">{item.timesWorn}×</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resale Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Resale Opportunities
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {leastWorn.length} items • ~${leastWorn.reduce((sum, item) => sum + estimatedValue(item), 0)} potential value
            </p>
          </div>
        </div>

        {leastWorn.length === 0 ? (
          <Card className="border-2 border-black">
            <CardContent className="py-12 text-center">
              <p className="text-sm text-muted-foreground">All items are well-loved!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {leastWorn.map((item) => (
              <Card key={item.id} className="border-2 border-black hover-lift-brutal">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 border-2 border-black overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.type} • {item.category}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Worn {item.timesWorn}×</span>
                        {item.lastWorn && <span>Last: {item.lastWorn}</span>}
                        <span className="font-bold text-black">~${estimatedValue(item)}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSellOnDepop(item)}
                          className="flex-1 h-8 text-xs border-2 border-black hover:bg-black hover:text-white"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Depop
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSellOnVinted(item)}
                          className="flex-1 h-8 text-xs border-2 border-black hover:bg-black hover:text-white"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Vinted
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Color Distribution */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Palette className="w-5 h-5" />
            Top Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topColors.map(([color, count]) => (
              <div key={color} className="flex items-center gap-4 pb-4 border-b-2 border-black last:border-0 last:pb-0">
                <div
                  className="w-10 h-10 border-2 border-black"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <p className="font-bold text-sm capitalize">{color}</p>
                </div>
                <span className="text-xl font-bold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Tag className="w-5 h-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between pb-4 border-b-2 border-black last:border-0 last:pb-0">
                <span className="font-bold text-sm capitalize">{category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-3 bg-gray-100 border-2 border-black">
                    <div
                      className="h-full bg-black"
                      style={{ width: `${(count / totalItems) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-sm w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}