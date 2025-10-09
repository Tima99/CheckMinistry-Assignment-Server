export default function formatOrdersWithCount(
    orderRows: {
      id: number;
      orderDescription: string;
      createdAt: Date;
      _count: { products: number };
    }[]
  ) {
    return orderRows.map((order) => {
      return {
        ...order,
        count: order._count.products,
        //  remove fields
        _count: undefined,
      };
    });
  }
  