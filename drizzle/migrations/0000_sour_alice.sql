CREATE TABLE `companies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`companyName` text(255) NOT NULL,
	`cnpj` text(18) NOT NULL,
	`contactEmail` text(320) NOT NULL,
	`contactPhone` text(20),
	`planId` integer,
	`approved` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`planId`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `companies_cnpj_unique` ON `companies` (`cnpj`);--> statement-breakpoint
CREATE TABLE `educationalContents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(255) NOT NULL,
	`contentType` text NOT NULL,
	`description` text NOT NULL,
	`contentUrl` text(500),
	`thumbnailUrl` text(500),
	`published` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`companyId` integer NOT NULL,
	`employeeName` text(255) NOT NULL,
	`employeeEmail` text(320) NOT NULL,
	`department` text(100),
	`position` text(100),
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `healthProfessionals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`professionalName` text(255) NOT NULL,
	`specialty` text(100) NOT NULL,
	`registrationNumber` text(50) NOT NULL,
	`contactEmail` text(320) NOT NULL,
	`contactPhone` text(20),
	`bio` text,
	`approved` integer DEFAULT false NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `healthProfessionals_registrationNumber_unique` ON `healthProfessionals` (`registrationNumber`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`planName` text(100) NOT NULL,
	`planType` text NOT NULL,
	`price` integer NOT NULL,
	`billingPeriod` text NOT NULL,
	`maxEmployees` integer,
	`features` text,
	`active` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `surveyResponses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employeeId` integer NOT NULL,
	`responseDate` integer NOT NULL,
	`moodLevel` integer NOT NULL,
	`stressLevel` integer NOT NULL,
	`fatigueLevel` integer NOT NULL,
	`workSatisfaction` integer NOT NULL,
	`observations` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text(64) NOT NULL,
	`name` text,
	`email` text(320),
	`loginMethod` text(64),
	`role` text DEFAULT 'user' NOT NULL,
	`userType` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`lastSignedIn` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);