CREATE TABLE `investors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL DEFAULT '',
	`email` varchar(255) NOT NULL DEFAULT '',
	`website` varchar(255) NOT NULL DEFAULT '',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `investors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectAmenities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`type` enum('school','hospital','market','park','transport','shopping') NOT NULL,
	`name` varchar(255) NOT NULL,
	`distance` varchar(100) NOT NULL DEFAULT '',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectAmenities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`imageUrl` varchar(500) NOT NULL,
	`caption` varchar(255) NOT NULL DEFAULT '',
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectImages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectPricing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`unitType` varchar(100) NOT NULL,
	`area` varchar(50) NOT NULL,
	`price` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectPricing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL DEFAULT (''),
	`address` varchar(255) NOT NULL,
	`wardId` int NOT NULL,
	`investorId` int NOT NULL,
	`latitude` varchar(50) NOT NULL,
	`longitude` varchar(50) NOT NULL,
	`totalUnits` int NOT NULL,
	`soldUnits` int NOT NULL DEFAULT 0,
	`unitArea` varchar(100) NOT NULL DEFAULT '',
	`pricePerM2` varchar(100) NOT NULL DEFAULT '',
	`status` enum('opening_sale','coming_soon','completed','under_construction','handed_over') NOT NULL,
	`progress` int NOT NULL DEFAULT 0,
	`completionDate` varchar(50) NOT NULL DEFAULT '',
	`projectType` enum('apartment','townhouse','mixed') NOT NULL DEFAULT 'apartment',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`district` varchar(255) NOT NULL,
	`latitude` varchar(50) NOT NULL,
	`longitude` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wards_id` PRIMARY KEY(`id`)
);
