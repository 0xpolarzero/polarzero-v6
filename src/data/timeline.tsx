import type { ReactNode } from "react";
import { Link } from "@/components/link";

export type TimelineCategory =
  | "work"
  | "experiments"
  | "writing"
  | "education"
  | "research";

export type TimelineLinkKey =
  | "website"
  | "github"
  | "twitter"
  | "article"
  | "docs";

export type TimelineItem = {
  title: string;
  category: TimelineCategory;
  from: string;
  to?: string | null;
  caption: string;
  description: ReactNode;
  links?: Partial<Record<TimelineLinkKey, string>>;
};

export type TimelineYear = {
  year: string;
  items: TimelineItem[];
};

export const TIMELINE: TimelineYear[] = [
  {
    year: "2025",
    items: [
      {
        title: "Tevm",
        category: "work",
        from: "2025-04",
        caption:
          "Contributing to a multi-language library for running an EVM in every environment",
        description: (
          <ul className="list-inside text-sm">
            <li>
              -{" "}
              <Link
                href="https://github.com/evmts/compiler/blob/main/libs/compiler/README.md"
                className="mr-2"
              >
                @tevm/compiler
              </Link>
              shipped a Solidity & Vyper compiler around Foundry compilers for
              Typescript;
            </li>
            <li>
              -{" "}
              <Link href="https://github.com/evmts/guillotine" className="mr-2">
                guillotine
              </Link>
              worked on a high-performance EVM implementation in Zig;
            </li>
            <li>
              -{" "}
              <Link href="https://github.com/evmts/chop" className="mr-2">
                chop
              </Link>
              worked on a CLI tool for EVM disassembly and simulation in Golang
              using{" "}
              <Link
                href="https://github.com/charmbracelet/bubbletea"
                className="mr-2"
              >
                BubbleTea
              </Link>
              ;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/evmts/tevm-monorepo/tree/main/extensions/test-matchers"
                className="mr-2"
              >
                @tevm/test-matchers
              </Link>
              shipped a Javascript library that extends Vitest with EVM-related
              test matchers;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/evmts/tevm-monorepo/tree/main/extensions/test-node"
                className="mr-2"
              >
                @tevm/test-node
              </Link>
              shipped a Javascript library to snapshot EVM JSON-RPC calls in
              Vitest/Bun.
            </li>
          </ul>
        ),
        links: {
          website: "https://tevm.sh",
          github: "https://github.com/evmts",
          twitter: "https://x.com/tevmtools",
        },
      },
      {
        title: "Primodium",
        category: "work",
        from: "2024-04",
        to: "2025-03",
        caption:
          "Worked at a startup exploring onchain games and crypto user-facing products",
        description: (
          <ul className="list-inside text-sm">
            <li>
              -{" "}
              <Link
                href="https://github.com/primodiumxyz/dex-indexer-stack/tree/main/packages/indexer"
                className="mr-2"
              >
                DEX Indexer
              </Link>
              shipped a{" "}
              <Link
                href="https://github.com/rpcpool/yellowstone-grpc"
                className="mr-2"
              >
                Yellowstone gRPC
              </Link>{" "}
              Typescript indexer for Solana DEX trades;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/primodiumxyz/dex-indexer-stack/tree/main/packages/gql"
                className="mr-2"
              >
                DEX GraphQL
              </Link>
              shipped a{" "}
              <Link
                href="https://github.com/hasura/graphql-engine"
                className="mr-2"
              >
                Hasura
              </Link>{" "}
              +{" "}
              <Link
                href="https://github.com/timescale/timescaledb"
                className="mr-2"
              >
                Timescale
              </Link>{" "}
              GraphQL client for querying DEX activity & analytics on Solana;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/primodiumxyz/dex-server"
                className="mr-2"
              >
                DEX Server
              </Link>
              worked on a tRPC server for building and sponsoring user
              transactions on Solana;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/primodiumxyz/tub-ios"
                className="mr-2"
              >
                Tub
              </Link>
              worked on an iOS trading app on Solana with a TikTok-inspired UX;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/primodiumxyz/gasless"
                className="mr-2"
              >
                Gasless server
              </Link>
              shipped a{" "}
              <Link href="https://github.com/latticexyz/mud" className="mr-0.5">
                MUD
              </Link>
              -compatible gasless server library for EVM chains;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/primodiumxyz/empires"
                className="mr-2"
              >
                Primodium Empires
              </Link>
              worked on a fully onchain turn-based prediction market game on
              Ethereum;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/primodiumxyz/reactive-tables"
                className="mr-2"
              >
                Reactive Tables
              </Link>
              shipped a state management library for onchain games built on{" "}
              <Link href="https://github.com/latticexyz/mud" className="mr-2">
                MUD
              </Link>
              for Typescript & React;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/primodiumxyz/primodium"
                className="mr-2"
              >
                Primodium v0.11
              </Link>
              worked on a fully onchain MMO.
            </li>
          </ul>
        ),
        links: {
          website: "https://primodium.com",
          github: "https://github.com/primodiumxyz",
          twitter: "https://x.com/primodiumgame",
        },
      },
      {
        title: "evmstate",
        category: "experiments",
        from: "2025-03",
        to: "2025-05",
        caption:
          "A TypeScript library for tracing and visualizing EVM state changes with detailed human-readable labeling",
        description: (
          <span className="text-sm">
            <Link
              href="https://npmjs.com/package/@polareth/evmstate"
              className="mr-2"
            >
              @polareth/evmstate
            </Link>{" "}
            traces all state changes after a transaction execution in a local
            VM, or by watching transactions in incoming blocks. It retrieves and
            labels storage slots with semantic insights and provides a detailed
            diff of all changes. Built with{" "}
            <Link href="https://tevm.sh" className="mr-0.5">
              Tevm
            </Link>
            and{" "}
            <Link href="https://github.com/shazow/whatsabi" className="mr-0.5">
              Whatsabi
            </Link>
            .
          </span>
        ),
        links: {
          github: "https://github.com/polareth/evmstate",
          docs: "https://evmstate.polareth.org",
        },
      },
      {
        title: "nightwatch",
        category: "experiments",
        from: "2025-04-13",
        to: "2025-04-20",
        caption: "A public archive of onchain scam investigations",
        description: (
          <span className="text-sm">
            Nightwatch catalogs research from onchain sleuths on Twitter &
            Telegram, as a public archive and convenient research tool. Built
            with{" "}
            <Link href="https://remix.run" className="mr-0.5">
              Remix
            </Link>
            ,{" "}
            <Link href="https://neon.tech" className="mr-0.5">
              Neon
            </Link>{" "}
            and{" "}
            <Link href="https://deno.com" className="mr-0.5">
              Deno
            </Link>
          </span>
        ),
        links: {
          website: "https://nightwatch.polareth.org",
          github: "https://github.com/polareth/nightwatch",
          twitter: "https://twitter.com/polarethorg",
        },
      },
    ],
  },
  {
    year: "2024",
    items: [
      {
        title: "savvy",
        category: "experiments",
        from: "2024-02-03",
        to: "2024-04-01",
        caption: "A browser interface to simulate and visualize EVM activity",
        description: (
          <span className="text-sm">
            savvy exposes an interface to fork a chain and tweak its network
            conditions, to simulate complex onchain interactions and visualize
            results & gas usage, both on L1 and L2 EVM chains. Built with{" "}
            <Link href="https://tevm.sh" className="mr-0.5">
              Tevm
            </Link>
            and{" "}
            <Link href="https://github.com/shazow/whatsabi" className="mr-0.5">
              Whatsabi
            </Link>{" "}
            and{" "}
            <Link href="https://nextjs.org" className="mr-0.5">
              Next.js
            </Link>
            .
          </span>
        ),
        links: {
          website: "https://svvy.sh",
          github: "https://github.com/polareth/savvy",
          twitter: "https://x.com/polarethorg",
        },
      },
      {
        title: "Research: EVM gas benchmarks",
        category: "research",
        from: "2024-02",
        to: "2024-03",
        caption: "Various research projects on EVM gas usage and tooling",
        description: (
          <ul className="list-inside text-sm">
            <li>
              -{" "}
              <Link
                href="https://polarzero.xyz/gas-visualizer?author=0xpolarzero&repo=airdrop-gas-benchmarks"
                className="mr-2"
              >
                airdrop gas benchmarks
              </Link>{" "}
              a series of tests to benchmark gas usage across ERC20/721/1155
              patterns with batched, merkle, and claim style drops, picked from
              popular airdrop contracts—comes with an interactive dashboard to
              analyze costs based on airdrop parameters;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/0xpolarzero/gas-metering-comparison"
                className="mr-2"
              >
                gas metering comparison
              </Link>{" "}
              cross-validated gas reports from popular tooling against live
              executions with{" "}
              <Link
                href="https://github.com/foundry-rs/foundry"
                className="mr-0.5"
              >
                Foundry
              </Link>
              ,{" "}
              <Link
                href="https://github.com/NomicFoundation/hardhat"
                className="mr-0.5"
              >
                Hardhat
              </Link>
              , and{" "}
              <Link href="https://github.com/evmts/tevm" className="mr-0.5">
                Tevm
              </Link>
              on identical calldata sets, and documented discrepancies.
            </li>
          </ul>
        ),
      },
    ],
  },
  {
    year: "2023",
    items: [
      {
        title: "Research: EVM security",
        category: "research",
        from: "2023-11",
        to: "2023-12",
        caption: "Various research projects on EVM security and tooling",
        description: (
          <ul className="list-inside text-sm">
            <li>
              -{" "}
              <Link href="https://glide.r.xyz" className="mr-2">
                Glider
              </Link>{" "}
              joined Secureum workshop sessions to battle-test Glider on live
              exploit scenarios, and submitted documentation fixes and clarified
              flows for security researchers;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/0xpolarzero/storage-collision-formal-verification"
                className="mr-2"
              >
                storage collision
              </Link>{" "}
              a reference research for verifying smart contract assumptions
              using fuzzing & formal verification tools (here exhibiting storage
              collision) with{" "}
              <Link
                href="https://github.com/foundry-rs/foundry"
                className="mr-0.5"
              >
                Foundry
              </Link>
              ,{" "}
              <Link href="https://github.com/certora/halmos" className="mr-0.5">
                Halmos
              </Link>{" "}
              and{" "}
              <Link
                href="https://github.com/certora/certora"
                className="mr-0.5"
              >
                Certora
              </Link>
              ;
            </li>
            <li>
              -{" "}
              <Link
                href="https://github.com/0xpolarzero/superform-erc1155a-fuzzing/"
                className="mr-2"
              >
                ERC1155A
              </Link>{" "}
              a reference fuzzing test suite on a token extension to verify
              assumptions and surface edge cases.
            </li>
          </ul>
        ),
      },
      {
        title: "Experiments: web-based 3D & spatial audio",
        category: "experiments",
        from: "2023-01",
        to: "2023-05",
        caption:
          "Various projects with Three.js/React Three Fiber and 3D spatial audio engines",
        description: (
          <ul className="list-inside text-sm">
            <li>
              -{" "}
              <Link href="https://echoes.polarzero.xyz/" className="mr-2">
                echoes
              </Link>{" "}
              a contemplative yet interactive onchain collectible, made of
              particles, as part of an immersive audiovisual experience;
            </li>
            <li>
              -{" "}
              <Link href="https://poligraph.polarzero.xyz/" className="mr-2">
                poligraph
              </Link>{" "}
              a 3D graph to help visualize political relationships in the French
              Assemblée Nationale;
            </li>
            <li>
              -{" "}
              <Link
                href="https://immersiveaudio.polarzero.xyz/"
                className="mr-2"
              >
                metaverse
              </Link>{" "}
              a virtual world on the browser with interactive 3D audio
              sources—built while alpha-testing{" "}
              <Link href="https://www.atmoky.com/" className="mr-0.5">
                Atmoky
              </Link>{" "}
              spatial audio engine and as part of a research paper on immersive
              audio in virtual worlds;
            </li>
            <li>
              -{" "}
              <Link href="https://esthesis.polarzero.xyz/" className="mr-2">
                esthesis
              </Link>{" "}
              a multi-platform 3D visualizer for music NFTs.
            </li>
          </ul>
        ),
      },
      {
        title: "cascade",
        category: "experiments",
        from: "2023-05-22",
        to: "2023-06-11",
        caption:
          "(Just another attempt at a) decentralized automated crowdfunding platform, with automated and flexible recurring payments",
        description: (
          <span className="text-sm">
            An interface between founders and contributors, where the latter can
            plan their contributions over a specified period, give out their
            funds to a secured contract, let the payments be sent automatically,
            and still pull back if they don't feel confident anymore at some
            point. Built during Chainlink Fall 2023 hackathon.
          </span>
        ),
        links: {
          website: "https://devpost.com/software/cascade-u14fdb",
          github:
            "https://github.com/0xpolarzero/decentralized-autonomous-crownfunding",
          docs: "https://youtu.be/4tHtIcdVorY",
        },
      },
      {
        title: "Chainlink Functions",
        category: "work",
        from: "2023-01-23",
        to: "2023-03-07",
        caption:
          "Tested Chainlink Functions across alpha and beta releases with public examples",
        description: (
          <div className="text-sm">
            Tested Chainlink Functions during Alpha (01-03/2023) and Beta
            (09/2023); provided some now outdated examples and demo for
            showcasing during release:
            <ul className="list-inside">
              <li>
                -{" "}
                <Link href="https://github.com/0xpolarzero/chainlink-functions-next-starter">
                  Next.js starter
                </Link>
              </li>
              <li>
                -{" "}
                <Link href="https://github.com/0xpolarzero/cross-chain-ERC20-balance-verification">
                  cross-chain ERC20 balance verification
                </Link>
              </li>
              <li>
                -{" "}
                <Link href="https://github.com/0xpolarzero/twitter-verifier-chainlink-functions">
                  onchain Twitter verifier
                </Link>
              </li>
            </ul>
          </div>
        ),
        links: {
          website: "https://chain.link/functions",
          docs: "https://youtu.be/N5jvHRSJVME",
        },
      },
      {
        title: "Blockchain, but for real",
        category: "writing",
        from: "2023-10-27",
        to: "2023-11-07",
        caption:
          "An article on blockchain fundamentals, misconceptions, and future outlooks",
        description: (
          <ul className="list-inside text-sm">
            <li>
              -{" "}
              <Link
                href="https://medium.com/@0xpolarzero/blockchain-but-for-real-e1d8c0e0ebfc"
                className="mr-2"
              >
                Blockchain, but for real (EN)
              </Link>
              some explanations about blockchain: current perception, what is it
              actually, how it works, perspectives for the future, and what to
              do now;
            </li>
            <li>
              -{" "}
              <Link
                href="https://medium.com/@0xpolarzero/la-blockchain-mais-pour-de-vrai-0fed9b951af9"
                className="mr-2"
              >
                La blockchain, mais pour de vrai (FR)
              </Link>
              quelques explications sur la blockchain : perceptions actuelles,
              ce que c'est réellement, fonctionnement, perspectives futures, ce
              qu'on peut faire maintenant.
            </li>
          </ul>
        ),
        links: {
          article:
            "https://medium.com/@0xpolarzero/blockchain-but-for-real-e1d8c0e0ebfc",
        },
      },
      {
        title: "Decentralized systems, end the cycle of indifference",
        category: "writing",
        from: "2023-10-12",
        to: "2023-10-17",
        caption:
          "An article on democracies, delegation and decentralized systems",
        description: (
          <span className="text-sm">
            How traditional democracies tend to favor indifference, through
            delegation of knowledge and awareness, and how decentralized systems
            can help by incentivizing active participation in governance.
          </span>
        ),
        links: {
          article:
            "https://medium.com/@0xpolarzero/decentralized-systems-end-the-cycle-of-indifference-8c19d7167778",
        },
      },
      {
        title: "Chainlink's new dawn",
        category: "writing",
        from: "2023-09-22",
        to: "2023-10-02",
        caption: "An article on Chainlink after CCIP",
        description: (
          <span className="text-sm">
            A reflection on Chainlink's latest milestones, and key aspects from
            a developer's perspective.
          </span>
        ),
        links: {
          article:
            "https://medium.com/@0xpolarzero/chainlinks-new-dawn-725d7a6881cb",
        },
      },
      {
        title: "Smart contract security, terminology of a review",
        category: "writing",
        from: "2023-09-17",
        to: "2023-09-18",
        caption: "An article on smart contract security terminology",
        description: (
          <span className="text-sm">
            Navigating the rambling world of smart contract security, and
            specifically the terminology/technical jargon, from the perspective
            of a newcomer.
          </span>
        ),
        links: {
          article:
            "https://medium.com/@0xpolarzero/smart-contract-security-terminology-of-a-review-99b9203c9824",
        },
      },
      {
        title: "Lesson #0, fundamentals of Solidity storage",
        category: "writing",
        from: "2023-06-28",
        to: "2023-06-29",
        caption: "An article on the fundamentals of Solidity storage",
        description: (
          <span className="text-sm">
            The storage layout in the EVM, how data is meticulously stored and
            managed with Solidity.
          </span>
        ),
        links: {
          website:
            "https://medium.com/@0xpolarzero/fundamentals-of-solidity-storage-581ba0551b3",
          twitter: "https://twitter.com/0xpolarzero",
        },
      },
      {
        title: "Alchemy University",
        category: "education",
        from: "2023-01-03",
        to: "2023-02-12",
        caption: "online",
        description: (
          <span className="text-sm">
            A seven-week Ethereum bootcamp on cryptography fundamentals, data
            structures, EVM internals, UTXO/account-based models, smart
            contracts...
          </span>
        ),
        links: {
          website: "https://university.alchemy.com/overview/ethereum",
          github: "https://github.com/0xpolarzero/AU-ethereum-bootcamp",
        },
      },
    ],
  },
  {
    year: "2022",
    items: [
      {
        title: "Three.js Journey",
        category: "education",
        from: "2022-11-27",
        to: "2022-12-06",
        caption: "online",
        description: (
          <span className="text-sm">
            An extensive introduction to Web-based 3D with WebGL, using Three.js
            and React Three Fiber: physics, modeling, interactions, shaders,
            post-processing, optimization, R3F and Drei...
          </span>
        ),
        links: {
          website: "https://threejs-journey.xyz/",
          github: "https://github.com/0xpolarzero/three-js-journey",
        },
      },
      {
        title: "promise",
        category: "experiments",
        from: "2022-10-17",
        to: "2022-11-19",
        caption:
          "An onchain app to help keep founders accountable for their promises",
        description: (
          <span className="text-sm">
            A decentralized app that allows founders to create and get involved
            into <em>promises</em>, that will be forever recorded and associated
            to their identity. Won Chainlink Top Quality Projects and QuickNode
            1st Prize.
          </span>
        ),
        links: {
          website: "https://devpost.com/software/promise-erftax",
          github:
            "https://github.com/0xpolarzero/chainlink-fall-2022-hackathon",
          docs: "https://polarzero.gitbook.io/promise",
        },
      },
      {
        title: "Fullstack Solidity/JavaScript course",
        category: "education",
        from: "2022-09-23",
        to: "2022-10-15",
        caption: "online",
        description: (
          <span className="text-sm">
            A comprehensive introduction to all the core concepts related to
            blockchain, and developing smart contracts with JavaScript and
            Solidity by Patrick Collins.
          </span>
        ),
        links: {
          website:
            "https://github.com/smartcontractkit/full-blockchain-solidity-course-js",
          github:
            "https://github.com/0xpolarzero/full-blockchain-solidity-course-js",
        },
      },
      {
        title: "What is the metaverse anyway?",
        category: "writing",
        from: "2022-05-10",
        to: "2022-05-14",
        caption: "A short article to try to define the metaverse",
        description: (
          <span className="text-sm">
            Breaking through some of the most common misconceptions, in an
            article derived from my research on immersive virtual worlds.
          </span>
        ),
        links: {
          article: "https://blog.polarzero.xyz/what-is-the-metaverse-anyway",
        },
      },
      {
        title: "The Odin Project",
        category: "education",
        from: "2022-02-05",
        to: "2022-06-12",
        caption: "online",
        description: (
          <span className="text-sm">
            An open-source fullstack Javascript curriculum for learning web
            development with JavaScript, Node.js, Express, MongoDB, React...
          </span>
        ),
        links: {
          website: "https://www.theodinproject.com/",
        },
      },
      {
        title: "Master in Music and Music Production",
        category: "education",
        from: "2020",
        to: "2022",
        caption: "SAE Institute, Paris, France",
        description: (
          <div className="text-sm flex flex-col gap-1">
            <p className="mb-1">
              Master's degree in sound engineering, music theory, mixing,
              mastering, arrangement and orchestration.
            </p>
            <p>
              Wrote a Master's thesis on immersive audio integration in virtual
              worlds.
            </p>
            <div>
              <blockquote className="italic pl-4 border-l-2 border-secondary/30">
                Une place pour l’audio immersif dans le Web 3.0 : intégration
                dans le métavers; adaptation à un nouveau modèle, immersion dans
                un espace en pleine expansion, expériences immersives
                accessibles et avancées...
              </blockquote>
            </div>
            <ul className="list-inside">
              <li>
                -{" "}
                <Link href="https://polarzero.notion.site/M-moire-de-M2-Antton-Lepretre-51e31e37f8124a09a948322dac59a124">
                  Paper (online)
                </Link>
              </li>
              <li>
                -{" "}
                <Link href="https://drive.google.com/file/d/1r0_ZjVGLb32tfxoBmrERJypyCV6No36u/view">
                  Paper (PDF)
                </Link>
              </li>
            </ul>
          </div>
        ),
        links: {
          website: "https://www.sae.edu/fra/courses/master-musique/",
        },
      },
    ],
  },
  {
    year: "2020",
    items: [
      {
        title: "Bachelor in Music and Sound Engineering",
        category: "education",
        from: "2019",
        to: "2020",
        caption: "Université Gustave Eiffel, Paris, France",
        description: (
          <span className="text-sm">
            Bachelor's degree in music and sound engineering, musicology,
            harmony, acoustics, recording, sound design.
          </span>
        ),
        links: {
          website:
            "https://lact.univ-gustave-eiffel.fr/formations/licences/musique-et-metiers-du-son",
        },
      },
    ],
  },
  {
    year: "2019",
    items: [
      {
        title: "Advanced Technician Certificate in Audiovisual Production",
        category: "education",
        from: "2017",
        to: "2019",
        caption: "Lycée Suger, Paris, France",
        description: (
          <span className="text-sm">
            Majoring in Sound Engineering; audio recording, sound design,
            post-production (editing, mixing), applied physics and acoustics...
            (~Associate's degree).
          </span>
        ),
        links: {
          website: "https://suger.fr/?page_id=638",
        },
      },
    ],
  },
];
