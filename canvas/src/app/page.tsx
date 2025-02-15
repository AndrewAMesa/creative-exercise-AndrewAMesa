"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [clickAmount, setClickAmount] = useState<{ amount: number }>({ amount: 0 });

  useEffect(() => {
    async function fetchData() {
      if (!canvasRef.current || !clickPosition) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      try {
        let response = await fetch("/api/draw/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        let result = await response.json();
        const { x, y } = clickPosition;

        setClickAmount((prev) => ({ amount: prev.amount + 1 }));
        if (clickAmount.amount === 20) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          setClickAmount({ amount: 0 });
        }

        if (result.data === 0) {
          ctx.fillStyle = "blue";
          ctx.fillRect(x - 50, y - 25, 100, 50);
        } else if (result.data === 1) {
          ctx.beginPath();
          ctx.arc(x, y, 40, 0, Math.PI * 2);
          ctx.fillStyle = "green";
          ctx.fill();
        } else if (result.data === 2) {
          ctx.beginPath();
          ctx.moveTo(x, y - 40);
          ctx.lineTo(x - 40, y + 40);
          ctx.lineTo(x + 40, y + 40);
          ctx.closePath();
          ctx.fillStyle = "red";
          ctx.fill();
        } else if (result.data === 3) {
          const gradient = ctx.createLinearGradient(x - 50, y - 25, x + 50, y + 25);
          gradient.addColorStop(0, "pink");
          gradient.addColorStop(1, "purple");
          ctx.fillStyle = gradient;
          ctx.fillRect(x - 50, y - 25, 100, 50);
        } else if (result.data === 4) {
            ctx.font = "bold 30px Arial";
            ctx.fillStyle = "orange";
            ctx.fillText("AWESOME", x - 40, y);
        }
      } catch (error) {
        console.error("Error fetching drawing data:", error);
      }
    }

    fetchData();
  }, [clickPosition]);

  return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "black",
        color: "white",
        textAlign: "center"
      }}>
        <h1 style={{ marginBottom: "20px" }}>Click on the Canvas to Draw</h1>
        <canvas
            ref={canvasRef}
            width={1000}
            height={500}
            style={{
              backgroundColor: "white",
              border: "1px solid black"
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setClickPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
        />
      </div>
  );
}
