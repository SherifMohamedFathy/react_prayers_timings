import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
export default function Prayer({ name, time, image }) {
  return (
    // <Card className="card">
    <Card sx={{ minWidth: "14vw" }} className="card">
      <CardMedia sx={{ height: 140 }} image={image} title="green iguana" />
      <CardContent>
        <h2>{name}</h2>
        <Typography variant="h3" color="text.secondary">
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}
