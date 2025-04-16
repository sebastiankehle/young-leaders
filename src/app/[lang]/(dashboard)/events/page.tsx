import { Locale, getDictionary } from "../../dictionaries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        {dict.navigation.events}
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample event cards - replace with actual data */}
        <EventCard
          title="Leadership Workshop"
          date="June 15, 2024"
          location="Berlin, Germany"
          description="A workshop focused on developing leadership skills for young professionals."
        />
        <EventCard
          title="Networking Meetup"
          date="July 3, 2024"
          location="Munich, Germany"
          description="Connect with other young leaders and industry professionals."
        />
        <EventCard
          title="Sustainability Conference"
          date="August 21, 2024"
          location="Hamburg, Germany"
          description="Learn about sustainable business practices and environmental leadership."
        />
      </div>
    </div>
  );
}

// Helper component for event cards
function EventCard({
  title,
  date,
  location,
  description,
}: {
  title: string;
  date: string;
  location: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {date} • {location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
