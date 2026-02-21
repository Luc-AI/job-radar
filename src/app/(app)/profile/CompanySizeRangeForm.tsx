"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Loader } from "react-feather";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { updateCompanySizeRange, CompanySizeRangeState } from "./actions";

const MIN = 1;
const MAX = 10000;

// Logarithmic scale: slider position (0-100) ↔ employee count (1-10000)
function sliderToValue(pos: number): number {
  const minLog = Math.log(MIN);
  const maxLog = Math.log(MAX);
  const value = Math.exp(minLog + (pos / 100) * (maxLog - minLog));
  return Math.round(value);
}

function valueToSlider(val: number): number {
  const minLog = Math.log(MIN);
  const maxLog = Math.log(MAX);
  return ((Math.log(val) - minLog) / (maxLog - minLog)) * 100;
}

function formatEmployees(value: number): string {
  if (value >= 10000) return "10.000+";
  if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return value.toLocaleString("de-CH");
}

interface CompanySizeRangeFormProps {
  initialMin: number;
  initialMax: number;
}

const initialState: CompanySizeRangeState = {};

export function CompanySizeRangeForm({
  initialMin,
  initialMax,
}: CompanySizeRangeFormProps) {
  const [range, setRange] = useState<[number, number]>([initialMin, initialMax]);

  const hasChanges = range[0] !== initialMin || range[1] !== initialMax;

  const handleCancel = () => {
    setRange([initialMin, initialMax]);
  };

  const handleSliderChange = (positions: number[]) => {
    const newMin = sliderToValue(positions[0]);
    const newMax = sliderToValue(positions[1]);
    setRange([newMin, newMax]);
  };

  const sliderValue = [valueToSlider(range[0]), valueToSlider(range[1])];

  const [state, formAction, pending] = useActionState(
    updateCompanySizeRange,
    initialState
  );
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      toast.success("Gespeichert");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unternehmensgrösse</CardTitle>
        <CardDescription>
          Bevorzugte Mitarbeiterzahl ({formatEmployees(range[0])} –{" "}
          {formatEmployees(range[1])}).
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="sizeMin" value={range[0]} />
          <input type="hidden" name="sizeMax" value={range[1]} />

          <div>
            <Label className="mb-4 block">Mitarbeiterzahl</Label>
            <Slider
              value={sliderValue}
              onValueChange={handleSliderChange}
              min={0}
              max={100}
              step={1}
              minStepsBetweenThumbs={5}
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>1</span>
              <span>10</span>
              <span>100</span>
              <span>1.000</span>
              <span>10.000+</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            {hasChanges && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Abbrechen
              </Button>
            )}
            <Button type="submit" disabled={pending || !hasChanges}>
              {pending ? (
                <>
                  <Loader className="animate-spin" />
                  Speichern...
                </>
              ) : (
                "Speichern"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
