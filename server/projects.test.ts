import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database helpers to return deterministic values
vi.mock("./db", () => {
  return {
    getAllProjects: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: "Dự án NOXH Hòa Khánh",
        address: "Đường số 4, KCN Hòa Khánh",
        wardId: 1,
        investorId: 1,
        latitude: "16.0678",
        longitude: "108.2212",
        totalUnits: 300,
        soldUnits: 120,
        unitArea: "50-70m²",
        pricePerM2: "15,000,000 VNĐ/m²",
        status: "under_construction",
        progress: 45,
        completionDate: "Q4 2025",
        projectType: "apartment",
      }
    ]),
    getProjectById: vi.fn().mockImplementation(async (id: number) => {
      if (id === 1) {
        return {
          id: 1,
          name: "Dự án NOXH Hòa Khánh",
          address: "Đường số 4, KCN Hòa Khánh",
          wardId: 1,
          investorId: 1,
          latitude: "16.0678",
          longitude: "108.2212",
          totalUnits: 300,
          soldUnits: 120,
          unitArea: "50-70m²",
          pricePerM2: "15,000,000 VNĐ/m²",
          status: "under_construction",
          progress: 45,
          completionDate: "Q4 2025",
          projectType: "apartment",
        };
      }
      return null;
    }),
    getWards: vi.fn().mockResolvedValue([
      { id: 1, name: "Phường Hòa Khánh Bắc", district: "Quận Liên Chiểu", latitude: "16.0678", longitude: "108.2212" }
    ]),
    getInvestors: vi.fn().mockResolvedValue([
      { id: 1, name: "Công ty Cổ phần Xây dựng", phone: "02363123456", email: "info@xaydung.vn", website: "xaydung.vn" }
    ]),
    getProjectImages: vi.fn().mockResolvedValue([
      { id: 1, projectId: 1, imageUrl: "image1.jpg", caption: "Ảnh tiến độ", order: 1 }
    ]),
    getProjectAmenities: vi.fn().mockResolvedValue([
      { id: 1, projectId: 1, type: "school", name: "Trường Tiểu Học", distance: "500m" }
    ]),
    getProjectPricingData: vi.fn().mockResolvedValue([
      { id: 1, projectId: 1, unitType: "2 PN", area: "60m²", price: "900 triệu" }
    ]),
    getDashboardKPI: vi.fn().mockResolvedValue({
      totalProjects: 1,
      totalUnits: 300,
      availableUnits: 180,
      soldUnits: 120,
      soldPercentage: 40,
      opening_sale: 0,
      coming_soon: 0,
      under_construction: 1,
      completed: 0,
      handed_over: 0,
    }),
  };
});

function createMockContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as any,
    res: {} as any,
  };
}

describe("projects router", () => {
  it("list procedure merges project with ward and investor details", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.projects.list();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 1,
      name: "Dự án NOXH Hòa Khánh",
      ward: "Phường Hòa Khánh Bắc",
      investorName: "Công ty Cổ phần Xây dựng",
    });
  });

  it("getById procedure retrieves complete project details", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.projects.getById({ id: 1 });

    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      id: 1,
      name: "Dự án NOXH Hòa Khánh",
      ward: "Phường Hòa Khánh Bắc",
      investorName: "Công ty Cổ phần Xây dựng",
      investorPhone: "02363123456",
      investorEmail: "info@xaydung.vn",
      investorWebsite: "xaydung.vn",
    });
    expect(result?.images).toHaveLength(1);
    expect(result?.amenities).toHaveLength(1);
    expect(result?.pricing).toHaveLength(1);
  });

  it("kpi procedure retrieves dashboard analytics", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.projects.kpi();

    expect(result).not.toBeNull();
    expect(result).toMatchObject({
      totalProjects: 1,
      totalUnits: 300,
      availableUnits: 180,
      soldUnits: 120,
      soldPercentage: 40,
    });
  });
});
