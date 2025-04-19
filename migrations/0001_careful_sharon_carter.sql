CREATE TABLE `alumni_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_profile_id` text NOT NULL,
	`department` text NOT NULL,
	`course` text NOT NULL,
	`graduation_year` text NOT NULL,
	FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `student_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_profile_id` text NOT NULL,
	`department` text NOT NULL,
	`course` text NOT NULL,
	`graduation_year` text NOT NULL,
	`roll_number` text NOT NULL,
	`id_card_photo_url` text,
	FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`phone_number` text NOT NULL,
	`individual_type` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `visitor_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_profile_id` text NOT NULL,
	`address` text NOT NULL,
	`district` text NOT NULL,
	`city` text NOT NULL,
	`pin_code` text NOT NULL,
	FOREIGN KEY (`user_profile_id`) REFERENCES `user_profile`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `event_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `event_coordinators` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`user_id` text,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_to_category_map` (
	`event_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `category_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `event_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`hosted_by` text NOT NULL,
	`location` text NOT NULL,
	`thumbnail` text NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`entry_fee` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `discount_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`event_id` text,
	`ticket_type_id` text,
	`discount_type` text NOT NULL,
	`discount_value` integer NOT NULL,
	`max_uses` integer,
	`current_uses` integer DEFAULT 0,
	`start_date` integer,
	`end_date` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `discount_codes_code_unique` ON `discount_codes` (`code`);--> statement-breakpoint
CREATE TABLE `discount_usage` (
	`id` text PRIMARY KEY NOT NULL,
	`discount_id` text NOT NULL,
	`ticket_id` text NOT NULL,
	`user_id` text NOT NULL,
	`used_at` integer NOT NULL,
	FOREIGN KEY (`discount_id`) REFERENCES `discount_codes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ticket_types` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`available_quantity` integer,
	`max_per_user` integer DEFAULT 1,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`ticket_type_id` text NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`transaction_id` text NOT NULL,
	`status` text NOT NULL,
	`qr_code` text NOT NULL,
	`purchase_date` integer NOT NULL,
	`check_in_date` integer,
	`checked_in_by` text,
	FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`checked_in_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payment_details` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`card_last_4` text,
	`card_brand` text,
	`upi_id` text,
	`bank_name` text,
	`wallet_name` text,
	`payment_processor` text NOT NULL,
	`receipt_url` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` text PRIMARY KEY NOT NULL,
	`transaction_id` text NOT NULL,
	`amount` integer NOT NULL,
	`reason` text NOT NULL,
	`processed_by` text,
	`gateway_refund_id` text,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`processed_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`event_id` text NOT NULL,
	`amount` integer NOT NULL,
	`payment_method` text NOT NULL,
	`status` text NOT NULL,
	`gateway_transaction_id` text,
	`gateway_response` text,
	`refund_status` text DEFAULT 'none' NOT NULL,
	`refunded_amount` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `admin_action_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`details` text,
	`ip_address` text,
	`user_agent` text,
	`timestamp` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `permissions_name_unique` ON `permissions` (`name`);--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`role_id` text NOT NULL,
	`permission_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `roles_name_unique` ON `roles` (`name`);--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role_id` text NOT NULL,
	`assigned_by` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assigned_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`user_id` text NOT NULL,
	`ticket_id` text NOT NULL,
	`checked_in_at` integer NOT NULL,
	`checked_in_by` text NOT NULL,
	`check_in_method` text DEFAULT 'qr_scan' NOT NULL,
	`check_in_location` text,
	`verification_status` text DEFAULT 'success' NOT NULL,
	`notes` text,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`checked_in_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `attendance_log_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`attendance_id` text NOT NULL,
	`action` text NOT NULL,
	`timestamp` integer NOT NULL,
	`processed_by` text,
	`notes` text,
	FOREIGN KEY (`attendance_id`) REFERENCES `attendance`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`processed_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `temporary_access_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`event_id` text NOT NULL,
	`ticket_id` text,
	`qr_code` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`is_used` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE no action
);
