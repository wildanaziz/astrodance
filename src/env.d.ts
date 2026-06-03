/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: import('./shared/utils/jwt').JWTPayload;
  }
}
