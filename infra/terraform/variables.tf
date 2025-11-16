# Additional variables for infrastructure configuration

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "enable_public_subnets" {
  description = "Enable public subnets for load balancers"
  type        = bool
  default     = true
}

variable "enable_private_subnets" {
  description = "Enable private subnets for services"
  type        = bool
  default     = true
}

variable "database_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "enable_ssl" {
  description = "Enable SSL/TLS for services"
  type        = bool
  default     = true
}

