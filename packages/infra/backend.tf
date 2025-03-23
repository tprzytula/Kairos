terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "tprzytula"
    workspaces {
      name = "Kairos"
    }
  }
}