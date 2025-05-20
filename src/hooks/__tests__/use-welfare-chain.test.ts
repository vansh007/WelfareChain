import { renderHook, act } from "@testing-library/react";
import { useWelfareChain } from "../use-welfare-chain";


// 
describe("useWelfareChain", () => {
  const mockSchemes = [
    {
      name: "Test Scheme 1",
      description: "Description 1",
      budget: BigInt("1000000000000000000"),
      maxBeneficiaries: 100,
      isActive: true,
    },
  ];

  const mockBeneficiaries = [
    {
      address: "0x123...",
      name: "Test Beneficiary",
      id: "B001",
      isActive: true,
    },
  ];

  beforeEach(() => {
    // Mock useContractRead
    (useContractRead as jest.Mock).mockImplementation(({ functionName }) => {
      if (functionName === "getAllSchemes") {
        return { data: mockSchemes, isLoading: false };
      }
      if (functionName === "getAllBeneficiaries") {
        return { data: mockBeneficiaries, isLoading: false };
      }
      return { data: null, isLoading: false };
    });

    // Mock useContractWrite
    (useContractWrite as jest.Mock).mockReturnValue({
      write: jest.fn(),
      data: null,
    });

    // Mock useWaitForTransaction
    (useWaitForTransaction as jest.Mock).mockReturnValue({
      isLoading: false,
    });
  });

  it("returns schemes and beneficiaries data", () => {
    const { result } = renderHook(() => useWelfareChain());

    expect(result.current.schemes).toEqual(mockSchemes);
    expect(result.current.beneficiaries).toEqual(mockBeneficiaries);
  });

  it("handles addNewScheme", async () => {
    const mockWrite = jest.fn();
    (useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      data: null,
    });

    const { result } = renderHook(() => useWelfareChain());

    await act(async () => {
      await result.current.addNewScheme(
        "New Scheme",
        "Description",
        "1.0",
        100
      );
    });

    expect(mockWrite).toHaveBeenCalledWith({
      args: ["New Scheme", "Description", expect.any(BigInt), 100],
    });
  });

  it("handles addNewBeneficiary", async () => {
    const mockWrite = jest.fn();
    (useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      data: null,
    });

    const { result } = renderHook(() => useWelfareChain());

    await act(async () => {
      await result.current.addNewBeneficiary(
        "0x123...",
        "New Beneficiary",
        "B002"
      );
    });

    expect(mockWrite).toHaveBeenCalledWith({
      args: ["0x123...", "New Beneficiary", "B002"],
    });
  });

  it("handles applyToScheme", async () => {
    const mockWrite = jest.fn();
    (useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      data: null,
    });

    const { result } = renderHook(() => useWelfareChain());

    await act(async () => {
      await result.current.applyToScheme(1);
    });

    expect(mockWrite).toHaveBeenCalledWith({
      args: [1],
    });
  });

  it("handles approveBeneficiaryApplication", async () => {
    const mockWrite = jest.fn();
    (useContractWrite as jest.Mock).mockReturnValue({
      write: mockWrite,
      data: null,
    });

    const { result } = renderHook(() => useWelfareChain());

    await act(async () => {
      await result.current.approveBeneficiaryApplication("0x123...", 1);
    });

    expect(mockWrite).toHaveBeenCalledWith({
      args: ["0x123...", 1],
    });
  });

  it("handles loading states", () => {
    (useContractRead as jest.Mock).mockImplementation(({ functionName }) => {
      if (functionName === "getAllSchemes") {
        return { data: null, isLoading: true };
      }
      if (functionName === "getAllBeneficiaries") {
        return { data: null, isLoading: true };
      }
      return { data: null, isLoading: false };
    });

    const { result } = renderHook(() => useWelfareChain());

    expect(result.current.isLoadingSchemes).toBe(true);
    expect(result.current.isLoadingBeneficiaries).toBe(true);
  });

  it("handles transaction loading states", () => {
    (useWaitForTransaction as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    const { result } = renderHook(() => useWelfareChain());

    expect(result.current.isAddingScheme).toBe(true);
    expect(result.current.isAddingBeneficiary).toBe(true);
    expect(result.current.isApplyingForScheme).toBe(true);
    expect(result.current.isApprovingApplication).toBe(true);
  });
}); 