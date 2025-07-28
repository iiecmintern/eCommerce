import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Construction, 
  MessageCircle, 
  Lightbulb,
  ArrowRight
} from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  features?: string[];
  comingSoon?: boolean;
}

export default function PlaceholderPage({ 
  title, 
  description, 
  features = [], 
  comingSoon = true 
}: PlaceholderPageProps) {
  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="container max-w-2xl text-center">
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-muted">
                  <Construction className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>

              <Badge variant="secondary" className="mb-4">
                {comingSoon ? "Coming Soon" : "In Development"}
              </Badge>

              <h1 className="text-3xl font-bold mb-4">{title}</h1>
              <p className="text-lg text-muted-foreground mb-8">{description}</p>

              {features.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-4 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Planned Features
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This page is currently under development. Continue the conversation 
                  to have me build out this section with full functionality.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Home
                    </Link>
                  </Button>

                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Request This Feature
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
