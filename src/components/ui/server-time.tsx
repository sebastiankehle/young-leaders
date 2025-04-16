"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Locale } from "@/app/[lang]/dictionaries";

interface ServerTimeProps {
  lang: Locale;
}

interface WorldTimeResponse {
  datetime: string;
  unixtime: number;
}

export function ServerTime({ lang }: ServerTimeProps) {
  const [time, setTime] = useState<string>("--:--:--");
  const [loading, setLoading] = useState<boolean>(true);
  const dateRef = useRef<Date | null>(null);

  useEffect(() => {
    // Function to fetch time from WorldTimeAPI for Europe/Berlin
    const fetchTime = async () => {
      try {
        const response = await fetch(
          "https://worldtimeapi.org/api/timezone/Europe/Berlin",
        );
        if (!response.ok) throw new Error("Failed to fetch time");

        const data: WorldTimeResponse = await response.json();

        // Parse the datetime string
        dateRef.current = new Date(data.datetime);

        // Format and display
        updateDisplay();
        setLoading(false);

        return true;
      } catch (error) {
        console.error("Error fetching time:", error);
        // On first load, show error state if we can't get the time
        if (loading) {
          setTime("Error");
          setLoading(false);
        }
        return false;
      }
    };

    // Updates the time display with the current dateRef value
    const updateDisplay = () => {
      if (!dateRef.current) return;

      try {
        const formattedTime = dateRef.current.toLocaleTimeString(lang, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setTime(formattedTime);
      } catch (error) {
        console.error("Error updating time display:", error);
        const fallbackTime = dateRef.current.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setTime(fallbackTime);
      }
    };

    // Increment the seconds of our stored date
    const incrementSeconds = () => {
      if (dateRef.current) {
        // Add one second to our reference date
        dateRef.current.setSeconds(dateRef.current.getSeconds() + 1);
        updateDisplay();
      }
    };

    // Fetch time immediately
    fetchTime();

    // Set up intervals
    const secondIntervalId = setInterval(incrementSeconds, 1000); // Update display every second
    const fetchIntervalId = setInterval(fetchTime, 30000); // Fetch from API every 30 seconds

    return () => {
      clearInterval(secondIntervalId);
      clearInterval(fetchIntervalId);
    };
  }, [lang]);

  return loading ? null : (
    <div className="text-muted-foreground text-sm" title="Berlin Time">
      {time}
    </div>
  );
}
