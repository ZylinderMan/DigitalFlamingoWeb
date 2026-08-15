"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const TETROMINOES: { cells: [number, number][]; color: string }[] = [
  { cells: [[0, 0], [1, 0], [2, 0], [3, 0]], color: "#22d3ee" }, // I
  { cells: [[0, 0], [1, 0], [0, 1], [1, 1]], color: "#facc15" }, // O
  { cells: [[0, 0], [1, 0], [2, 0], [1, 1]], color: "#a78bfa" }, // T
  { cells: [[1, 0], [2, 0], [0, 1], [1, 1]], color: "#4ade80" }, // S
  { cells: [[0, 0], [1, 0], [1, 1], [2, 1]], color: "#f87171" }, // Z
  { cells: [[0, 0], [0, 1], [1, 1], [2, 1]], color: "#60a5fa" }, // J
  { cells: [[2, 0], [0, 1], [1, 1], [2, 1]], color: "#fb923c" }, // L
];

const BLOCK_SIZE = 24; // was 18
const PIECE_COUNT = 5; // slightly fewer since pieces are now bigger
const WALL_THICKNESS = 40;

export default function UIUXGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const { Engine, World, Bodies, Body, Mouse, MouseConstraint, Runner } = Matter;

    // More solver iterations + sleeping bodies are what actually remove
    // the small residual "wiggle" a default matter-js setup has at rest.
    const engine = Engine.create({
      positionIterations: 10,
      velocityIterations: 8,
      constraintIterations: 4,
    });
    engine.gravity.y = 1;
    engine.enableSleeping = true;

    // Four static walls, positioned so their inner faces sit exactly on
    // the canvas edges. This is the actual bounding box — nothing,
    // dragged or not, can cross these.
    const half = WALL_THICKNESS / 2;
    const wallOptions = { isStatic: true, friction: 0.8 };
    World.add(engine.world, [
      Bodies.rectangle(width / 2, height + half, width, WALL_THICKNESS, wallOptions), // floor
      Bodies.rectangle(width / 2, -half, width, WALL_THICKNESS, wallOptions), // ceiling
      Bodies.rectangle(-half, height / 2, WALL_THICKNESS, height, wallOptions), // left
      Bodies.rectangle(width + half, height / 2, WALL_THICKNESS, height, wallOptions), // right
    ]);

    // Spawn pieces already inside the box (near the top), so they never
    // start outside the walls we just built.
    const bodies: Matter.Body[] = [];
    for (let i = 0; i < PIECE_COUNT; i++) {
      const def = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
      const parts = def.cells.map(([cx, cy]) =>
        Bodies.rectangle(cx * BLOCK_SIZE, cy * BLOCK_SIZE, BLOCK_SIZE - 2, BLOCK_SIZE - 2, {
          chamfer: { radius: 3 }, // slightly rounded corners = fewer corner-catch jitters
          render: { fillStyle: def.color },
        })
      );
      const compound = Body.create({
        parts,
        restitution: 0.05, // low bounciness — high restitution is the main cause of "wiggle"
        friction: 0.85,
        frictionStatic: 1,
        frictionAir: 0.02,
        slop: 0.01,
      });
      const margin = 70;
      Body.setPosition(compound, {
        x: margin + Math.random() * Math.max(width - margin * 2, 1),
        y: 20 + i * 45,
      });
      Body.setAngle(compound, Math.random() * Math.PI);
      bodies.push(compound);
    }
    World.add(engine.world, bodies);

    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    World.add(engine.world, mouseConstraint);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const ctx = canvas.getContext("2d");
    let animationId: number;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const body of bodies) {
        const parts = body.parts.length > 1 ? body.parts.slice(1) : body.parts;
        for (const part of parts) {
          const vertices = part.vertices;
          ctx.beginPath();
          ctx.moveTo(vertices[0].x, vertices[0].y);
          for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
          }
          ctx.closePath();
          ctx.fillStyle = (part.render.fillStyle as string) || "#888";
          ctx.fill();
          ctx.strokeStyle = "rgba(0,0,0,0.3)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      animationId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}