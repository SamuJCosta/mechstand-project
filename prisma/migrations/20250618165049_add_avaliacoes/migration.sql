-- CreateTable
CREATE TABLE `Avaliacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nota` INTEGER NOT NULL,
    `comentario` TEXT NULL,
    `clienteId` INTEGER NOT NULL,
    `mecanicoId` INTEGER NOT NULL,
    `reparacaoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Avaliacao_reparacaoId_key`(`reparacaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_mecanicoId_fkey` FOREIGN KEY (`mecanicoId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_reparacaoId_fkey` FOREIGN KEY (`reparacaoId`) REFERENCES `Reparacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
