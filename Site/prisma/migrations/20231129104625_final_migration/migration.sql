-- CreateTable
CREATE TABLE "utilisateurs" (
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "groupe" (
    "nom" TEXT NOT NULL,

    CONSTRAINT "groupe_pkey" PRIMARY KEY ("nom")
);

-- CreateTable
CREATE TABLE "rappels" (
    "nom_groupe" TEXT NOT NULL,
    "nom_rappel" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "couleur" VARCHAR(6) NOT NULL,

    CONSTRAINT "rappels_pkey" PRIMARY KEY ("nom_rappel")
);

-- CreateIndex
CREATE UNIQUE INDEX "rappels_nom_groupe_key" ON "rappels"("nom_groupe");

-- AddForeignKey
ALTER TABLE "rappels" ADD CONSTRAINT "rappels_nom_groupe_fkey" FOREIGN KEY ("nom_groupe") REFERENCES "groupe"("nom") ON DELETE RESTRICT ON UPDATE CASCADE;
