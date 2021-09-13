class Star {
  name: string;
  image: any;
  raduis: number;
  position: number[];
  cita: number;
  T: number = 0;
  R: number = 0;
  mesh: any 
  constructor(
    name: string,
    image: any,
    raduis: number,
    position: number[],
    cita: number,
    T?: number,
    R?: number
  ) {
    this.name = name;
    this.image = image;
    this.raduis = raduis;
    this.position = position;
    this.cita = cita;
    this.T = T || 0;
    this.R = R || 0;
  }
}

export default Star;
