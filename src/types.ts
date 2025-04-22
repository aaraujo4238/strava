export interface Athlete {
  resource_state: number;
  firstname: string;
  lastname: string;
}

export interface Activity {
  resource_state: number;
  athlete: Athlete;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  workout_type: number | null;
}

export interface AthleteRanking {
  athlete: Athlete;
  totalDistance: number;
  totalElevation: number;
  activities: number;
}
