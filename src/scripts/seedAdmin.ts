import { prisma } from "../lib/prisma";
import { UserRole } from "../types/type";

async function seedingAdmin() {
  try {
    const storeDataAmin = {
      name: "jim",
      email: "admin123@gmail.com",
      password: "admin12345",
      role: UserRole.ADMIN,
    };

    const exits = await prisma.user.findUnique({
      where: {
        email: storeDataAmin.email,
      },
    });

    if (exits) {
      throw new Error("user already exists");
    }

    const createAdminData = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:4000",
        },
        body: JSON.stringify(storeDataAmin),
      }
    );
    console.log(createAdminData);

    if (createAdminData.ok) {
      await prisma.user.update({
        where: {
          email: storeDataAmin.email,
        },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

seedingAdmin();
