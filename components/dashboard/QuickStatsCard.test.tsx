import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ContactsApi } from "@/lib/client/api";
import QuickStatsCard from "./QuickStatsCard";

jest.mock("@/lib/client/api", () => ({
  ContactsApi: {
    list: jest.fn(),
  },
}));

const mockedList = ContactsApi.list as jest.MockedFunction<typeof ContactsApi.list>;

function renderWithQuery(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <ChakraProvider value={defaultSystem}>
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </ChakraProvider>
  );
}

const TODAY = new Date("2026-03-17T12:00:00.000Z");
const THREE_DAYS_AGO = new Date("2026-03-14T12:00:00.000Z");
const TWO_WEEKS_AGO = new Date("2026-03-03T12:00:00.000Z");

const contacts = [
  {
    id: "1",
    organisation: "TechStart Inc",
    description: null,
    ownerId: "u1",
    createdAt: TODAY.toISOString(),
    updatedAt: TODAY.toISOString(),
  },
  {
    id: "2",
    organisation: "Old Corp",
    description: null,
    ownerId: "u1",
    createdAt: TWO_WEEKS_AGO.toISOString(),
    updatedAt: TWO_WEEKS_AGO.toISOString(),
  },
  {
    id: "3",
    organisation: "Recent Ltd",
    description: null,
    ownerId: "u1",
    createdAt: THREE_DAYS_AGO.toISOString(),
    updatedAt: THREE_DAYS_AGO.toISOString(),
  },
];

describe("QuickStatsCard", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-03-17T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("shows spinner while loading", () => {
    mockedList.mockReturnValue(new Promise(() => {})); // never resolves
    const { container } = renderWithQuery(<QuickStatsCard />);
    expect(container.querySelectorAll(".chakra-spinner").length).toBeGreaterThan(0);
  });

  it("shows error message when API call fails", async () => {
    mockedList.mockRejectedValue(new Error("Network error"));
    renderWithQuery(<QuickStatsCard />);
    await waitFor(() => {
      expect(screen.getAllByText("Fehler beim Laden...").length).toBe(3);
    });
  });

  it("displays total contact count", async () => {
    mockedList.mockResolvedValue({ data: contacts, count: 3 });
    renderWithQuery(<QuickStatsCard />);
    await waitFor(() => {
      expect(screen.getByText("Kontakte gesamt")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });
  });

  it("counts only contacts from the last 7 days", async () => {
    mockedList.mockResolvedValue({ data: contacts, count: 3 });
    renderWithQuery(<QuickStatsCard />);
    // TODAY and THREE_DAYS_AGO are within 7 days, TWO_WEEKS_AGO is not
    await waitFor(() => {
      expect(screen.getByText("Diese Woche hinzugefügt")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("shows the most recently created contact", async () => {
    mockedList.mockResolvedValue({ data: contacts, count: 3 });
    renderWithQuery(<QuickStatsCard />);
    await waitFor(() => {
      expect(screen.getByText("Letzter Kontakt")).toBeInTheDocument();
      expect(screen.getByText(/TechStart Inc/)).toBeInTheDocument();
    });
  });

  it("shows dash for latest contact when no contacts exist", async () => {
    mockedList.mockResolvedValue({ data: [], count: 0 });
    renderWithQuery(<QuickStatsCard />);
    await waitFor(() => {
      expect(screen.getByText("–")).toBeInTheDocument();
    });
  });

  it("calls ContactsApi.list with correct pagination params", async () => {
    mockedList.mockResolvedValue({ data: [], count: 0 });
    renderWithQuery(<QuickStatsCard />);
    await waitFor(() => {
      expect(mockedList).toHaveBeenCalledWith(0, 1000);
    });
  });
});
