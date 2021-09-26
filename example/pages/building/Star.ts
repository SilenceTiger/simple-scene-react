class Star {
  name: string;
  image: any;
  highImage: any;
  raduis: number;
  position: number[];
  cita: number;
  mesh: any 
  constructor(
    name: string,
    image: any,
    highImage: any,
    raduis: number,
    position: number[],
    cita: number,
  ) {
    this.name = name;
    this.image = image;
    this.highImage = highImage;
    this.raduis = raduis;
    this.position = position;
    this.cita = cita;
  }
}

export default Star;
