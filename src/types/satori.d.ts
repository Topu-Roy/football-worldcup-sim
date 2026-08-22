declare module "satori" {
  export interface FontOptions {
    name: string;
    data: Buffer | ArrayBuffer;
    weight: number | "normal" | "bold";
    style: "normal" | "italic";
  }

  export default function satori(
    element: unknown,
    options: {
      width: number;
      height: number;
      fonts: FontOptions[];
    },
  ): Promise<string>;
}
