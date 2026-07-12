import type { Promisable } from "type-fest"

type PipeFunction<Input, Output> = (input: Input) => Output
type PipeImplementationFunction = (input: never) => unknown

function callPipeFunction(func: PipeImplementationFunction, input: unknown) {
  return Reflect.apply(func, undefined, [input]) as unknown
}

function pipeValue(
  input: unknown,
  functions: readonly PipeImplementationFunction[],
) {
  let output = input

  for (const func of functions) {
    output = callPipeFunction(func, output)
  }

  return output
}

async function pipeValueAsync(
  input: unknown,
  functions: readonly PipeImplementationFunction[],
) {
  let output = await input

  for (const func of functions) {
    output = await callPipeFunction(func, output)
  }

  return output
}

export function pipe<A>(data: A): A
export function pipe<A, B>(data: A, funcA: PipeFunction<A, B>): B
export function pipe<A, B, C>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
): C
export function pipe<A, B, C, D>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
): D
export function pipe<A, B, C, D, E>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
): E
export function pipe<A, B, C, D, E, F>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
): F
export function pipe<A, B, C, D, E, F, G>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
): G
export function pipe<A, B, C, D, E, F, G, H>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
): H
export function pipe<A, B, C, D, E, F, G, H, I>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
): I
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
): J
export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
): K
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
  funcK: PipeFunction<K, L>,
): L
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
  funcK: PipeFunction<K, L>,
  funcL: PipeFunction<L, M>,
): M
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
  funcK: PipeFunction<K, L>,
  funcL: PipeFunction<L, M>,
  funcM: PipeFunction<M, N>,
): N
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
  funcK: PipeFunction<K, L>,
  funcL: PipeFunction<L, M>,
  funcM: PipeFunction<M, N>,
  funcN: PipeFunction<N, O>,
): O
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  data: A,
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
  funcK: PipeFunction<K, L>,
  funcL: PipeFunction<L, M>,
  funcM: PipeFunction<M, N>,
  funcN: PipeFunction<N, O>,
  funcO: PipeFunction<O, P>,
): P
export function pipe(
  data: unknown,
  ...functions: readonly PipeImplementationFunction[]
) {
  return pipeValue(data, functions)
}

export function piped<A>(): PipeFunction<A, A>
export function piped<A, B>(funcA: PipeFunction<A, B>): PipeFunction<A, B>
export function piped<A, B, C>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
): PipeFunction<A, C>
export function piped<A, B, C, D>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
): PipeFunction<A, D>
export function piped<A, B, C, D, E>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
): PipeFunction<A, E>
export function piped<A, B, C, D, E, F>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
): PipeFunction<A, F>
export function piped<A, B, C, D, E, F, G>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
): PipeFunction<A, G>
export function piped<A, B, C, D, E, F, G, H>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
): PipeFunction<A, H>
export function piped<A, B, C, D, E, F, G, H, I>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
): PipeFunction<A, I>
export function piped<A, B, C, D, E, F, G, H, I, J>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
): PipeFunction<A, J>
export function piped<A, B, C, D, E, F, G, H, I, J, K>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
): PipeFunction<A, K>
export function piped<A, B, C, D, E, F, G, H, I, J, K, L>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
  funcK: PipeFunction<K, L>,
): PipeFunction<A, L>
export function piped<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
  funcK: PipeFunction<K, L>,
  funcL: PipeFunction<L, M>,
): PipeFunction<A, M>
export function piped<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
  funcK: PipeFunction<K, L>,
  funcL: PipeFunction<L, M>,
  funcM: PipeFunction<M, N>,
): PipeFunction<A, N>
export function piped<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
  funcK: PipeFunction<K, L>,
  funcL: PipeFunction<L, M>,
  funcM: PipeFunction<M, N>,
  funcN: PipeFunction<N, O>,
): PipeFunction<A, O>
export function piped<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<B, C>,
  funcC: PipeFunction<C, D>,
  funcD: PipeFunction<D, E>,
  funcE: PipeFunction<E, F>,
  funcF: PipeFunction<F, G>,
  funcG: PipeFunction<G, H>,
  funcH: PipeFunction<H, I>,
  funcI: PipeFunction<I, J>,
  funcJ: PipeFunction<J, K>,
  funcK: PipeFunction<K, L>,
  funcL: PipeFunction<L, M>,
  funcM: PipeFunction<M, N>,
  funcN: PipeFunction<N, O>,
  funcO: PipeFunction<O, P>,
): PipeFunction<A, P>
export function piped(...functions: readonly PipeImplementationFunction[]) {
  return (data: unknown) => pipeValue(data, functions)
}

export function pipeAsync<A>(data: A): Promise<Awaited<A>>
export function pipeAsync<A, B>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
): Promise<Awaited<B>>
export function pipeAsync<A, B, C>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
): Promise<Awaited<C>>
export function pipeAsync<A, B, C, D>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
): Promise<Awaited<D>>
export function pipeAsync<A, B, C, D, E>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
): Promise<Awaited<E>>
export function pipeAsync<A, B, C, D, E, F>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
): Promise<Awaited<F>>
export function pipeAsync<A, B, C, D, E, F, G>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
): Promise<Awaited<G>>
export function pipeAsync<A, B, C, D, E, F, G, H>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
): Promise<Awaited<H>>
export function pipeAsync<A, B, C, D, E, F, G, H, I>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
): Promise<Awaited<I>>
export function pipeAsync<A, B, C, D, E, F, G, H, I, J>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
): Promise<Awaited<J>>
export function pipeAsync<A, B, C, D, E, F, G, H, I, J, K>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
): Promise<Awaited<K>>
export function pipeAsync<A, B, C, D, E, F, G, H, I, J, K, L>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
  funcK: PipeFunction<Awaited<K>, L>,
): Promise<Awaited<L>>
export function pipeAsync<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
  funcK: PipeFunction<Awaited<K>, L>,
  funcL: PipeFunction<Awaited<L>, M>,
): Promise<Awaited<M>>
export function pipeAsync<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
  funcK: PipeFunction<Awaited<K>, L>,
  funcL: PipeFunction<Awaited<L>, M>,
  funcM: PipeFunction<Awaited<M>, N>,
): Promise<Awaited<N>>
export function pipeAsync<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
  funcK: PipeFunction<Awaited<K>, L>,
  funcL: PipeFunction<Awaited<L>, M>,
  funcM: PipeFunction<Awaited<M>, N>,
  funcN: PipeFunction<Awaited<N>, O>,
): Promise<Awaited<O>>
export function pipeAsync<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  data: A,
  funcA: PipeFunction<Awaited<A>, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
  funcK: PipeFunction<Awaited<K>, L>,
  funcL: PipeFunction<Awaited<L>, M>,
  funcM: PipeFunction<Awaited<M>, N>,
  funcN: PipeFunction<Awaited<N>, O>,
  funcO: PipeFunction<Awaited<O>, P>,
): Promise<Awaited<P>>
export function pipeAsync(
  data: unknown,
  ...functions: readonly PipeImplementationFunction[]
) {
  return pipeValueAsync(data, functions)
}

export function pipedAsync<A>(): PipeFunction<
  Promisable<A>,
  Promise<Awaited<A>>
>
export function pipedAsync<A, B>(
  funcA: PipeFunction<A, B>,
): PipeFunction<Promisable<A>, Promise<Awaited<B>>>
export function pipedAsync<A, B, C>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
): PipeFunction<Promisable<A>, Promise<Awaited<C>>>
export function pipedAsync<A, B, C, D>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
): PipeFunction<Promisable<A>, Promise<Awaited<D>>>
export function pipedAsync<A, B, C, D, E>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
): PipeFunction<Promisable<A>, Promise<Awaited<E>>>
export function pipedAsync<A, B, C, D, E, F>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
): PipeFunction<Promisable<A>, Promise<Awaited<F>>>
export function pipedAsync<A, B, C, D, E, F, G>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
): PipeFunction<Promisable<A>, Promise<Awaited<G>>>
export function pipedAsync<A, B, C, D, E, F, G, H>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
): PipeFunction<Promisable<A>, Promise<Awaited<H>>>
export function pipedAsync<A, B, C, D, E, F, G, H, I>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
): PipeFunction<Promisable<A>, Promise<Awaited<I>>>
export function pipedAsync<A, B, C, D, E, F, G, H, I, J>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
): PipeFunction<Promisable<A>, Promise<Awaited<J>>>
export function pipedAsync<A, B, C, D, E, F, G, H, I, J, K>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
): PipeFunction<Promisable<A>, Promise<Awaited<K>>>
export function pipedAsync<A, B, C, D, E, F, G, H, I, J, K, L>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
  funcK: PipeFunction<Awaited<K>, L>,
): PipeFunction<Promisable<A>, Promise<Awaited<L>>>
export function pipedAsync<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
  funcK: PipeFunction<Awaited<K>, L>,
  funcL: PipeFunction<Awaited<L>, M>,
): PipeFunction<Promisable<A>, Promise<Awaited<M>>>
export function pipedAsync<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
  funcK: PipeFunction<Awaited<K>, L>,
  funcL: PipeFunction<Awaited<L>, M>,
  funcM: PipeFunction<Awaited<M>, N>,
): PipeFunction<Promisable<A>, Promise<Awaited<N>>>
export function pipedAsync<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
  funcK: PipeFunction<Awaited<K>, L>,
  funcL: PipeFunction<Awaited<L>, M>,
  funcM: PipeFunction<Awaited<M>, N>,
  funcN: PipeFunction<Awaited<N>, O>,
): PipeFunction<Promisable<A>, Promise<Awaited<O>>>
export function pipedAsync<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  funcA: PipeFunction<A, B>,
  funcB: PipeFunction<Awaited<B>, C>,
  funcC: PipeFunction<Awaited<C>, D>,
  funcD: PipeFunction<Awaited<D>, E>,
  funcE: PipeFunction<Awaited<E>, F>,
  funcF: PipeFunction<Awaited<F>, G>,
  funcG: PipeFunction<Awaited<G>, H>,
  funcH: PipeFunction<Awaited<H>, I>,
  funcI: PipeFunction<Awaited<I>, J>,
  funcJ: PipeFunction<Awaited<J>, K>,
  funcK: PipeFunction<Awaited<K>, L>,
  funcL: PipeFunction<Awaited<L>, M>,
  funcM: PipeFunction<Awaited<M>, N>,
  funcN: PipeFunction<Awaited<N>, O>,
  funcO: PipeFunction<Awaited<O>, P>,
): PipeFunction<Promisable<A>, Promise<Awaited<P>>>
export function pipedAsync(
  ...functions: readonly PipeImplementationFunction[]
) {
  return (data: unknown) => pipeValueAsync(data, functions)
}
