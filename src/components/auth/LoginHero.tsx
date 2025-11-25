export const LoginHero = () => {
  return (
    <div className="relative h-full w-full">
      <img
        src="/src/assets/images/parking_1.jpg"
        alt="Parking"
        className="object-cover h-full w-full"
      />
      <div className="absolute bottom-0 flex flex-col w-full items-center justify-center p-12 bg-white/80">
        <span className="font-montserrat text-3xl text-center font-extrabold text-blue-950">
          Gestión simple, resultados extraordinarios
        </span>
        <span className="text-xl text-center font-semibold text-blue-950">
          Automatización que transforma tu operación
        </span>
      </div>
    </div>
  );
};
