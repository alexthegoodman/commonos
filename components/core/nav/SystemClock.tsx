import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const { DateTime } = require("luxon");

export default function SystemClock() {
  const [time, setTime] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = DateTime.now();
      const nowTime = now.toLocaleString(DateTime.TIME_SIMPLE);
      const nowDay = now.toLocaleString(DateTime.DATE_FULL);
      setTime(nowTime);
      setDay(nowDay);
    };

    updateTime();

    const updater = setInterval(updateTime, 10000);

    return () => {
      clearInterval(updater);
    };
  }, []);
  return (
    <Box textAlign="right">
      <Box>
        <Typography variant="body1">{time}</Typography>
      </Box>
      <Box>
        <Typography variant="body1">{day}</Typography>
      </Box>
    </Box>
  );
}
