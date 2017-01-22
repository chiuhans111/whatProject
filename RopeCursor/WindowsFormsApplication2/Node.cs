using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFormsApplication2
{
    class Node
    {
        public float px, py;
        public float vx, vy;
        public float x, y;
        public void update()
        {
            px += vx/40;
            py += vy/40;
            vx *= 0.998f;
            vy *= 0.998f;
            x = px;
            y = py;
            vy+=0.015f;
        }

        public static void ConPhysics(Node a, Node b, float len)
        {
            var dx = a.px - b.px;
            var dy = a.py - b.py;
            var dd = dx * dx + dy * dy;
            var ddd = (float)Math.Sqrt(dd);
            if (ddd == 0) return;
            var df = (ddd - len)/8;
            b.vx += df * dx / ddd;
            b.vy += df * dy / ddd;
            a.vx -= df * dx / ddd;
            a.vy -= df * dy / ddd;
        }

        public static void ropePhysics(Node[] nodes, float len)
        {
            for (int j = 0; j < 30; j++)
            {
                for (int i = 0; i < nodes.Length - 1; i++)
                {
                    ConPhysics(nodes[i], nodes[i + 1], len);
                }
                foreach (var n in nodes) n.update();
            }


        }
    }


}
